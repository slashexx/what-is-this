import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'active' },
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
