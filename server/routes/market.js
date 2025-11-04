import express from 'express';
import jwt from 'jsonwebtoken';
import yahooFinance from 'yahoo-finance2';
import axios from 'axios';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

const cache = new Map();
const TTL = 60 * 1000;
function mock(sym) {
  const s = (sym || 'DEMO').toUpperCase();
  const seed = s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Number((50 + ((seed * 9301 + 49297) % 233280) / 233280 * 200).toFixed(2));
}

router.get('/quote', authenticateToken, async (req, res) => {
  try {
    const symbol = (req.query.symbol || '').trim().toUpperCase();
    if (!symbol) return res.status(400).json({ message: 'symbol is required' });
    const fresh = String(req.query.fresh || '').toLowerCase() === '1';
    const now = Date.now();
    let c = cache.get(symbol);
    if (fresh || !c || now - c.ts > TTL) {
      try {
        let price = null;
        let name = symbol;

        const avKey = process.env.ALPHAVANTAGE_API_KEY;
        if (avKey) {
          try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(avKey)}`;
            const resp = await axios.get(url, { timeout: 6000 });
            const gq = resp.data && resp.data['Global Quote'];
            const p = gq && (gq['05. price'] || gq['05. Price']);
            if (p) price = Number(p);
          } catch (_) {}
        }

        if (price == null) {
          const q = await yahooFinance.quote(symbol);
          price = q?.regularMarketPrice ?? null;
          name = q?.longName || q?.shortName || name;
        } else {
          try {
            const q = await yahooFinance.quote(symbol);
            name = q?.longName || q?.shortName || name;
          } catch (_) {}
        }

        if (price == null) {
          const stooqSym = symbol.includes('.') ? symbol.toLowerCase() : `${symbol.toLowerCase()}.us`;
          try {
            const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSym)}&f=sd2t2ohlcv&h&e=csv`;
            const resp = await axios.get(url, { timeout: 4000 });
            const line = String(resp.data).split(/\r?\n/)[1] || '';
            const cols = line.split(',');
            const close = cols[6] ? parseFloat(cols[6]) : NaN;
            if (!Number.isNaN(close)) price = close;
          } catch (_) {}
        }
        const payload = { symbol, company_name: name, price: price != null ? Number(price) : mock(symbol), fallback: price == null };
        c = { data: payload, ts: now };
        cache.set(symbol, c);
      } catch (e) {
        const payload = { symbol, company_name: symbol, price: mock(symbol), fallback: true };
        c = { data: payload, ts: now };
        cache.set(symbol, c);
      }
    }
    res.json(c.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
 
// Search symbols
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) return res.json([]);
    let items = [];
    try {
      const avKey = process.env.ALPHAVANTAGE_API_KEY;
      if (avKey) {
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(q)}&apikey=${encodeURIComponent(avKey)}`;
        const resp = await axios.get(url, { timeout: 6000 });
        const best = resp.data && (resp.data.bestMatches || resp.data['bestMatches']);
        if (Array.isArray(best)) {
          items = best.map(m => ({
            symbol: (m['1. symbol'] || m['symbol'] || '').toUpperCase(),
            name: m['2. name'] || m['name'] || '',
            exchange: m['4. region'] || m['region'] || ''
          })).filter(x => x.symbol);
        }
      }
      if (items.length === 0) {
        const results = await yahooFinance.search(q, { newsCount: 0, quotesCount: 10 });
        items = (results?.quotes || [])
          .filter(x => x.symbol && (x.quoteType === 'EQUITY' || x.quoteType === 'ETF'))
          .map(x => ({ symbol: x.symbol.toUpperCase(), name: x.longname || x.shortname || x.symbol, exchange: x.exchange || x.fullExchangeName || '' }));
      }
    } catch (_) {
      const common = [
        { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
        { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', exchange: 'NASDAQ' },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ' },
        { symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' },
        { symbol: 'META', name: 'Meta Platforms, Inc.', exchange: 'NASDAQ' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
        { symbol: 'NFLX', name: 'Netflix, Inc.', exchange: 'NASDAQ' },
        { symbol: 'BABA', name: 'Alibaba Group Holding Limited', exchange: 'NYSE' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' }
      ];
      const ql = q.toUpperCase();
      items = common.filter(s => s.symbol.startsWith(ql) || s.name.toUpperCase().includes(ql));
    }
    const unique = [];
    const seen = new Set();
    for (const it of items) {
      if (!seen.has(it.symbol)) { seen.add(it.symbol); unique.push(it); }
      if (unique.length >= 10) break;
    }
    res.json(unique);
  } catch (error) {
    res.json([]);
  }
});
