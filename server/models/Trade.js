import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_symbol: { type: String, required: true },
  company_name: { type: String, required: true },
  trade_type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  trade_date: { type: Date, default: Date.now },
  order_type: { type: String, enum: ['market', 'limit'], default: 'market' }
});

export default mongoose.model('Trade', tradeSchema);
