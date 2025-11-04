import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tradeRoutes from './routes/trades.js';
import portfolioRoutes from './routes/portfolio.js';
import goalRoutes from './routes/goals.js';
import watchlistRoutes from './routes/watchlist.js';
import predictionRoutes from './routes/predictions.js';
import aiRoutes from './routes/ai.js';
import marketRoutes from './routes/market.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stocksense')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/market', marketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
