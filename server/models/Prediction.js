import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_symbol: { type: String, required: true },
  company_name: { type: String, required: true },
  current_price: { type: Number, required: true },
  predicted_price_1d: { type: Number },
  predicted_price_7d: { type: Number },
  predicted_price_30d: { type: Number },
  recommendation: { 
    type: String, 
    enum: ['strong_buy', 'buy', 'hold', 'sell', 'strong_sell'],
    required: true 
  },
  confidence_score: { type: Number, required: true },
  reasoning: { type: String },
  risk_level: { 
    type: String, 
    enum: ['low', 'medium', 'high']
  },
  created_date: { type: Date, default: Date.now }
});

export default mongoose.model('Prediction', predictionSchema);
