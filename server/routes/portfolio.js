import express from 'express';
import jwt from 'jsonwebtoken';
import Portfolio from '../models/Portfolio.js';

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

// Get all portfolio positions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user_id: req.userId });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update portfolio position
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const position = await Portfolio.findOne({ 
      _id: req.params.id, 
      user_id: req.userId 
    });

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    Object.assign(position, req.body);
    position.updated_date = new Date();
    await position.save();

    res.json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete portfolio position
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const position = await Portfolio.findOne({ 
      _id: req.params.id, 
      user_id: req.userId 
    });

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Position deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
