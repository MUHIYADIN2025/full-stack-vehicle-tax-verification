import Admin from '../models/Admin.js';
import Officer from '../models/Officer.js';
import VehicleOwner from '../models/VehicleOwner.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password'
      });
    }

    // Try finding in Admin
    let user = await Admin.findOne({ email: identifier }).select('+password');
    let role = 'admin';

    // If not admin, try Officer (email or phone)
    if (!user) {
      user = await Officer.findOne({ 
        $or: [{ email: identifier }, { phone: identifier }] 
      }).select('+password').populate('assignedCheckpoint');
      role = 'officer';
    }

    // If not officer, try VehicleOwner (email or phone)
    if (!user) {
      user = await VehicleOwner.findOne({ 
        $or: [{ email: identifier }, { phone: identifier }] 
      }).select('+password');
      role = 'vehicleOwner';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        checkpointName: role === 'officer' ? user.assignedCheckpoint?.name : undefined,
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
