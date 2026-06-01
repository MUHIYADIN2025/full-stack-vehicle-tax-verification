import Officer from '../models/Officer.js';
import Checkpoint from '../models/Checkpoint.js';
import { generateToken } from '../utils/jwt.js';

export const registerOfficer = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, checkpoint } = req.body;

    // Validate input
    if (!fullName || !email || !phone || !password || !checkpoint) {
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

    // Check if officer already exists
    const existingOfficer = await Officer.findOne({ email });
    if (existingOfficer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Officer with this email already exists' 
      });
    }

    // Verify checkpoint exists
    const checkpointExists = await Checkpoint.findById(checkpoint);
    if (!checkpointExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid checkpoint' 
      });
    }

    // Create new officer
    const officer = new Officer({
      fullName,
      email,
      phone,
      password,
      assignedCheckpoint: checkpoint
    });

    await officer.save();

    const token = generateToken(officer._id, 'officer');

    res.status(201).json({
      success: true,
      message: 'Officer registered successfully',
      data: {
        officer: officer.toJSON(),
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

export const getOfficers = async (req, res) => {
  try {
    const officers = await Officer.find()
      .populate('assignedCheckpoint', 'name location')
      .select('-password');

    res.status(200).json({
      success: true,
      data: officers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getOfficerById = async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id)
      .populate('assignedCheckpoint', 'name location')
      .select('-password');

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: officer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateOfficer = async (req, res) => {
  try {
    const { fullName, phone, status } = req.body;
    const allowedUpdates = { fullName, phone, status };

    const officer = await Officer.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Officer updated successfully',
      data: officer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteOfficer = async (req, res) => {
  try {
    const officer = await Officer.findByIdAndDelete(req.params.id);

    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Officer not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Officer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
