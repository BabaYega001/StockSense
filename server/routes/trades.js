import express from 'express';
import jwt from 'jsonwebtoken';
import Trade from '../models/Trade.js';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';

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

// Get all trades for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.find({ user_id: req.userId }).sort({ trade_date: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trade
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { stock_symbol, company_name, trade_type, quantity, price, order_type } = req.body;

    const total_amount = quantity * price;
    
    // Check if user has enough balance for buy orders
    if (trade_type === 'buy') {
      const user = await User.findById(req.userId);
      if (user.virtual_balance < total_amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    }

    // Check if user has enough shares for sell orders
    if (trade_type === 'sell') {
      const portfolio = await Portfolio.findOne({ 
        user_id: req.userId, 
        stock_symbol 
      });
      if (!portfolio || portfolio.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient shares' });
      }
    }

    // Create trade record
    const trade = new Trade({
      user_id: req.userId,
      stock_symbol,
      company_name,
      trade_type,
      quantity,
      price,
      total_amount,
      order_type: order_type || 'market'
    });

    await trade.save();

    // Update user balance
    const user = await User.findById(req.userId);
    if (trade_type === 'buy') {
      user.virtual_balance -= total_amount;
      user.total_invested += total_amount;
    } else {
      user.virtual_balance += total_amount;
    }
    await user.save();

    // Update or create portfolio
    if (trade_type === 'buy') {
      const portfolio = await Portfolio.findOne({ 
        user_id: req.userId, 
        stock_symbol 
      });

      if (portfolio) {
        // Update existing position
        const newQuantity = portfolio.quantity + quantity;
        const newAvgPrice = ((portfolio.quantity * portfolio.average_price) + total_amount) / newQuantity;
        portfolio.quantity = newQuantity;
        portfolio.average_price = newAvgPrice;
        portfolio.total_invested += total_amount;
        portfolio.updated_date = new Date();
        await portfolio.save();
      } else {
        // Create new position
        const newPortfolio = new Portfolio({
          user_id: req.userId,
          stock_symbol,
          company_name,
          quantity,
          average_price: price,
          total_invested: total_amount,
          current_price: price,
          current_value: total_amount,
          unrealized_pnl: 0,
          unrealized_pnl_percentage: 0
        });
        await newPortfolio.save();
      }
    } else {
      // Sell order - update portfolio
      const portfolio = await Portfolio.findOne({ 
        user_id: req.userId, 
        stock_symbol 
      });

      if (portfolio) {
        portfolio.quantity -= quantity;
        portfolio.total_invested -= (portfolio.average_price * quantity);
        
        if (portfolio.quantity === 0) {
          await Portfolio.findByIdAndDelete(portfolio._id);
        } else {
          await portfolio.save();
        }
      }
    }

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
