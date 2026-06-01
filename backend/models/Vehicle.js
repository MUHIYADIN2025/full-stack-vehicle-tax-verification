import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Please provide plate number'],
    unique: true,
    uppercase: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleOwner',
    required: [true, 'Please provide owner']
  },
  vehicleType: {
    type: String,
    enum: ['Car', 'Motorcycle', 'Truck', 'Bus', 'SUV'],
    required: [true, 'Please provide vehicle type']
  },
  model: {
    type: String,
    required: [true, 'Please provide vehicle model'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please provide vehicle year']
  },
  color: {
    type: String,
    required: [true, 'Please provide vehicle color'],
    trim: true
  },
  taxAmount: {
    type: Number,
    required: [true, 'Please provide monthly tax amount'],
    min: 0
  },
  taxStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Expired'],
    default: 'Unpaid'
  },
  taxExpiryDate: {
    type: Date,
    required: [true, 'Please provide tax expiry date']
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  lastVerifiedAt: {
    type: Date,
    default: null
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

// Index for efficient queries
vehicleSchema.index({ ownerId: 1 });
vehicleSchema.index({ taxStatus: 1 });

export default mongoose.model('Vehicle', vehicleSchema);
