import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_symbol: { type: String, required: true },
  company_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  average_price: { type: Number, required: true },
  current_price: { type: Number },
  total_invested: { type: Number, required: true },
  current_value: { type: Number },
  unrealized_pnl: { type: Number },
  unrealized_pnl_percentage: { type: Number },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now }
});

export default mongoose.model('Portfolio', portfolioSchema);
