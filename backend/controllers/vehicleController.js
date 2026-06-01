import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';
import VehicleOwner from '../models/VehicleOwner.js';
import VerificationLog from '../models/VerificationLog.js';

export const registerVehicle = async (req, res) => {
  try {
    const { owner, plateNumber, vehicleType, model, year, color, taxAmount, taxStatus, taxExpiryDate } = req.body;

    // Validate input
    if (!owner || !plateNumber || !vehicleType || !model || !year || !color || !taxAmount || !taxExpiryDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if owner is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid owner ID format' 
      });
    }

    // Check if owner exists
    const ownerExists = await VehicleOwner.findById(owner);
    if (!ownerExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner does not exist' 
      });
    }

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ plateNumber: plateNumber.toUpperCase() });
    if (existingVehicle) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vehicle with this plate number already exists' 
      });
    }

    // Create new vehicle
    const vehicle = new Vehicle({
      plateNumber,
      ownerId: owner,
      vehicleType,
      model,
      year,
      color,
      taxAmount,
      taxStatus: taxStatus || 'Unpaid',
      taxExpiryDate: new Date(taxExpiryDate)
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('ownerId', 'fullName email phone');

    res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getVehicleByPlate = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ plateNumber: req.params.plateNumber.toUpperCase() })
      .populate('ownerId', 'fullName email phone');

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle ID format' });
    }

    const vehicle = await Vehicle.findById(req.params.id)
      .populate('ownerId', 'fullName email phone');

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getVehiclesByOwner = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.ownerId)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID format' });
    }

    const vehicles = await Vehicle.find({ ownerId: req.params.ownerId });

    res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle ID format' });
    }

    const { model, year, color, taxAmount, taxStatus, taxExpiryDate } = req.body;
    const allowedUpdates = { model, year, color, taxAmount, taxStatus, taxExpiryDate };

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).populate('ownerId', 'fullName email phone');

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle ID format' });
    }

    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const verifyVehicle = async (req, res) => {
  try {
    const { plateNumber, officerId, officerName, checkpointName } = req.body;
    
    if (!plateNumber) {
      return res.status(400).json({ success: false, message: 'Plate number is required' });
    }

    const vehicle = await Vehicle.findOne({ plateNumber: plateNumber.toUpperCase() })
      .populate('ownerId', 'fullName email phone');

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Update verification count and last verified date
    vehicle.verificationCount += 1;
    vehicle.lastVerifiedAt = new Date();
    await vehicle.save();

    // Create log record
    const log = new VerificationLog({
      vehicleId: vehicle._id,
      plateNumber: vehicle.plateNumber,
      ownerId: vehicle.ownerId ? vehicle.ownerId._id : null,
      ownerName: vehicle.ownerId ? vehicle.ownerId.fullName : 'Unknown',
      officerId: officerId || null,
      officerName: officerName || 'Unknown Officer',
      checkpointName: checkpointName || 'Unknown Checkpoint',
      taxStatus: vehicle.taxStatus
    });
    await log.save();

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
