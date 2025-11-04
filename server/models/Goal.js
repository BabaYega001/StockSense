import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  target_amount: { type: Number, required: true },
  current_amount: { type: Number, default: 0 },
  target_date: { type: Date, required: true },
  goal_type: { 
    type: String, 
    enum: ['retirement', 'house', 'education', 'emergency', 'wealth', 'vacation', 'other'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'achieved', 'paused'],
    default: 'active'
  },
  created_date: { type: Date, default: Date.now }
});

export default mongoose.model('Goal', goalSchema);
