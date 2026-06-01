import mongoose from 'mongoose';

const checkpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide checkpoint name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide checkpoint location'],
    trim: true
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Checkpoint', checkpointSchema);
