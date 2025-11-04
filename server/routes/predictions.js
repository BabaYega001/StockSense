import express from 'express';
import jwt from 'jsonwebtoken';
import Prediction from '../models/Prediction.js';

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

// Get all predictions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user_id: req.userId }).sort({ created_date: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new prediction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      stock_symbol, 
      company_name, 
      current_price,
      predicted_price_1d,
      predicted_price_7d,
      predicted_price_30d,
      recommendation,
      confidence_score,
      reasoning,
      risk_level
    } = req.body;

    const prediction = new Prediction({
      user_id: req.userId,
      stock_symbol,
      company_name,
      current_price,
      predicted_price_1d,
      predicted_price_7d,
      predicted_price_30d,
      recommendation,
      confidence_score,
      reasoning,
      risk_level
    });

    await prediction.save();
    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a prediction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Prediction.findOneAndDelete({ _id: id, user_id: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Prediction not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
