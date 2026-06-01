import Vehicle from '../models/Vehicle.js';
import VehicleOwner from '../models/VehicleOwner.js';
import Officer from '../models/Officer.js';
import VerificationLog from '../models/VerificationLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalOwners = await VehicleOwner.countDocuments();
    const totalOfficers = await Officer.countDocuments();
    
    // Non-compliant vehicles
    const nonCompliant = await Vehicle.find({
      taxStatus: { $in: ['Unpaid', 'Expired'] }
    }).limit(5);

    // Recent verifications
    // Note: VerificationLog model name check
    let recentLogs = [];
    try {
        recentLogs = await VerificationLog.find()
            .sort({ verifiedAt: -1 })
            .limit(6)
            .populate('vehicleId officerId checkpointId');
    } catch (e) {
        console.log("VerificationLog model might be named differently");
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalVehicles,
          totalOwners,
          totalOfficers,
          activeAlerts: nonCompliant.length // Simplified for now
        },
        nonCompliant,
        recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
