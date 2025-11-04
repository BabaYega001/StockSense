import express from 'express';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';

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

// Invoke LLM endpoint
router.post('/invoke', authenticateToken, async (req, res) => {
  try {
    const { prompt, add_context_from_internet, response_json_schema } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        message: 'AI service not configured. Please add OPENAI_API_KEY to your .env file.'
      });
    }

    const openai = new OpenAI({ apiKey });

    const systemMessage = response_json_schema 
      ? `You are a helpful AI assistant. Respond ONLY with valid JSON that matches this schema: ${JSON.stringify(response_json_schema)}`
      : 'You are a helpful AI assistant for stock market analysis and investment advice.';

    const messages = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ];

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;

    // Try to parse as JSON if schema was provided
    let parsedResponse = response;
    if (response_json_schema) {
      try {
        parsedResponse = JSON.parse(response);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    }

    // Always return string to match frontend's JSON.parse(response.response)
    const responsePayload = typeof parsedResponse === 'string' ? parsedResponse : JSON.stringify(parsedResponse);
    res.json({ response: responsePayload });
  } catch (error) {
    console.error('OpenAI API error:', error);
    const status = error.status || 500;
    let message = 'AI service error';
    if (error.code === 'insufficient_quota' || status === 429) {
      message = 'OpenAI quota exceeded. Please add billing or reduce usage, then try again.';
    } else if (error.code === 'model_not_found' || status === 404) {
      message = 'OpenAI model not available on this key. Set OPENAI_MODEL in server/.env to a model your key can access.';
    }

    // Optional mock fallback to keep demo usable
    const allowMock = (process.env.AI_MOCK_FALLBACK || 'on').toLowerCase() !== 'off';
    if (allowMock && (status === 429 || status === 404)) {
      try {
        const { prompt, response_json_schema } = req.body || {};
        const symbolMatch = (prompt || '').match(/\b([A-Z]{1,5})\b/);
        const sym = symbolMatch ? symbolMatch[1] : 'DEMO';
        // Deterministic pseudo-random based on symbol
        const seed = sym.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const rand = (n) => ((seed * 9301 + 49297) % 233280) / 233280 * n;
        const base = 50 + rand(200); // 50 - 250
        const drift = (p) => base * (1 + p);
        const mock = {
          current_price: Number(base.toFixed(2)),
          predicted_price_1d: Number(drift((rand(0.02) - 0.01)).toFixed(2)),
          predicted_price_7d: Number(drift((rand(0.06) - 0.03)).toFixed(2)),
          predicted_price_30d: Number(drift((rand(0.15) - 0.075)).toFixed(2)),
          recommendation: ['strong_sell','sell','hold','buy','strong_buy'][Math.floor(rand(5))],
          confidence_score: Math.min(95, Math.max(40, Math.floor(rand(100)))),
          risk_level: ['low','medium','high'][Math.floor(rand(3))],
          reasoning: `Mocked analysis for ${sym} due to AI service limits. This is placeholder data to keep the demo functional.`
        };

        // Always return string for compatibility with frontend parsing logic
        return res.json({ response: JSON.stringify(mock), fallback: true, note: message });
      } catch (e) {
        // If mock generation fails, fall through to error response
        console.error('Mock fallback failed:', e);
      }
    }
    res.status(status).json({ 
      message,
      error: error.message,
      code: error.code
    });
  }
});

export default router;
