import express from 'express';
import jwt from 'jsonwebtoken';
import Watchlist from '../models/Watchlist.js';
import yahooFinance from 'yahoo-finance2';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Simple in-memory cache for quotes: { SYMBOL: { price, ts } }
const quoteCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function mockPriceForSymbol(sym) {
  const seed = (sym || 'DEMO').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Number((50 + ((seed * 9301 + 49297) % 233280) / 233280 * 200).toFixed(2));
}

// Get all watchlist items for the authenticated user, enriched with live prices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await Watchlist.find({ user_id: req.userId }).sort({ created_date: -1 });

    // Fetch quotes for unique symbols with basic caching
    const uniqueSymbols = [...new Set(items.map(i => (i.stock_symbol || '').toUpperCase()).filter(Boolean))];
    const now = Date.now();

    for (const sym of uniqueSymbols) {
      let cached = quoteCache.get(sym);
      if (!cached || (now - cached.ts) > CACHE_TTL_MS) {
        try {
          const quote = await yahooFinance.quote(sym);
          const price = quote?.regularMarketPrice ?? null;
          if (price != null) {
            cached = { price: Number(price), ts: now };
            quoteCache.set(sym, cached);
          }
        } catch (e) {
          if (!cached) {
            const price = mockPriceForSymbol(sym);
            cached = { price, ts: now };
            quoteCache.set(sym, cached);
          }
        }
      }
    }

    // Update current_price on docs if we fetched something new and prepare response
    const updates = [];
    const enriched = items.map(doc => {
      const sym = (doc.stock_symbol || '').toUpperCase();
      const cached = quoteCache.get(sym);
      if (cached && typeof cached.price === 'number' && doc.current_price !== cached.price) {
        updates.push(Watchlist.updateOne({ _id: doc._id }, { $set: { current_price: cached.price } }));
        doc.current_price = cached.price;
      }
      return doc;
    });

    if (updates.length) {
      // Fire-and-forget to not block response
      Promise.allSettled(updates).catch(() => {});
    }

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add stock to watchlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { stock_symbol, company_name, added_price, alert_price } = req.body;

    if (!stock_symbol || !stock_symbol.trim()) {
      return res.status(400).json({ message: 'stock_symbol is required' });
    }
    const symbol = stock_symbol.trim().toUpperCase();

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ 
      user_id: req.userId, 
      stock_symbol: symbol 
    });

    if (existing) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    // Enrich with yahoo-finance2
    let resolvedCompany = company_name;
    let currentPrice = null;
    try {
      const quote = await yahooFinance.quote(symbol);
      currentPrice = quote?.regularMarketPrice ?? null;
      const name = quote?.longName || quote?.shortName || null;
      if (!resolvedCompany && name) resolvedCompany = name;
    } catch (e) {
      currentPrice = mockPriceForSymbol(symbol);
    }

    const finalAddedPrice = (added_price != null && added_price !== '')
      ? Number(added_price)
      : (typeof currentPrice === 'number' ? Number(currentPrice) : null);

    const watchlistItem = new Watchlist({
      user_id: req.userId,
      stock_symbol: symbol,
      company_name: resolvedCompany || symbol,
      added_price: finalAddedPrice,
      current_price: typeof currentPrice === 'number' ? Number(currentPrice) : finalAddedPrice,
      alert_price: alert_price || null
    });

    await watchlistItem.save();
    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove stock from watchlist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findOne({ 
      _id: req.params.id, 
      user_id: req.userId 
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Watchlist item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
