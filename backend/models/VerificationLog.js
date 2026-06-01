import mongoose from 'mongoose';

const verificationLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  plateNumber: { type: String, required: true },
  ownerName: { type: String, required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
  officerName: { type: String, required: true },
  checkpointName: { type: String, required: true },
  taxStatus: { type: String, required: true },
  verifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('VerificationLog', verificationLogSchema);
