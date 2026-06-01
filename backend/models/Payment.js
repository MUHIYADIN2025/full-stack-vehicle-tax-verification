import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleOwner',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'cash', 'online'],
    default: 'online'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'pending'
  },
  validMonths: {
    type: Number,
    required: true
  },
  newExpiryDate: {
    type: Date,
    required: true
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
paymentSchema.index({ vehicleId: 1 });
paymentSchema.index({ ownerId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paidAt: -1 });

export default mongoose.model('Payment', paymentSchema);
