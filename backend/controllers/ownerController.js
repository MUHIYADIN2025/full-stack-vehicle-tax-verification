import mongoose from 'mongoose';
import VehicleOwner from '../models/VehicleOwner.js';
import { generateToken } from '../utils/jwt.js';

export const registerOwner = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Validate input
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if owner already exists
    const existingOwner = await VehicleOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner with this email already exists' 
      });
    }

    // Create new owner
    const owner = new VehicleOwner({
      fullName,
      email,
      phone,
      password
    });

    await owner.save();

    const token = generateToken(owner._id, 'owner');

    res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      data: {
        owner: owner.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getOwners = async (req, res) => {
  try {
    const owners = await VehicleOwner.find().select('-password');

    res.status(200).json({
      success: true,
      data: owners
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getOwnerById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID format' });
    }

    const owner = await VehicleOwner.findById(req.params.id).select('-password');

    if (!owner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Owner not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateOwner = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID format' });
    }

    const { fullName, phone, status } = req.body;
    const allowedUpdates = { fullName, phone, status };

    const owner = await VehicleOwner.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!owner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Owner not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Owner updated successfully',
      data: owner
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteOwner = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid owner ID format' });
    }

    const owner = await VehicleOwner.findByIdAndDelete(req.params.id);

    if (!owner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Owner not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Owner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
