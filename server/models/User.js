import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  risk_profile: { 
    type: String, 
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },
  risk_score: { type: Number, default: 50 },
  investment_experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'experienced', 'expert'],
    default: 'beginner'
  },
  virtual_balance: { type: Number, default: 10000 },
  total_invested: { type: Number, default: 0 },
  created_date: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
