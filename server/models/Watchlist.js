import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_symbol: { type: String, required: true },
  company_name: { type: String, required: true },
  added_price: { type: Number },
  current_price: { type: Number },
  alert_price: { type: Number },
  created_date: { type: Date, default: Date.now }
});

export default mongoose.model('Watchlist', watchlistSchema);
