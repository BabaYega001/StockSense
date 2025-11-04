import express from 'express';
import jwt from 'jsonwebtoken';
import Goal from '../models/Goal.js';

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

// Get all goals for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.find({ user_id: req.userId }).sort({ created_date: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new goal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, target_amount, target_date, goal_type, status } = req.body;

    const goal = new Goal({
      user_id: req.userId,
      title,
      target_amount,
      target_date,
      goal_type,
      status: status || 'active',
      current_amount: 0
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a goal
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user_id: req.userId 
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    Object.assign(goal, req.body);
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a goal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user_id: req.userId 
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
