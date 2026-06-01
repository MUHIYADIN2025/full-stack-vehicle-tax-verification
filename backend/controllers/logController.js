import VerificationLog from '../models/VerificationLog.js';

export const getAllLogs = async (req, res) => {
  try {
    const logs = await VerificationLog.find()
      .populate('vehicleId', 'taxStatus')
      .sort({ verifiedAt: -1 })
      .lean();

    const activeLogs = logs
      .filter(log => log.vehicleId && log.vehicleId.taxStatus !== 'Paid')
      .map(log => ({ ...log, taxStatus: log.vehicleId.taxStatus }))
      .slice(0, 100);

    res.status(200).json({ success: true, data: activeLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOfficerLogs = async (req, res) => {
  try {
    const logs = await VerificationLog.find({ officerId: req.params.officerId })
      .populate('vehicleId', 'taxStatus')
      .sort({ verifiedAt: -1 })
      .lean();

    const activeLogs = logs
      .filter(log => log.vehicleId && log.vehicleId.taxStatus !== 'Paid')
      .map(log => ({ ...log, taxStatus: log.vehicleId.taxStatus }))
      .slice(0, 50);

    res.status(200).json({ success: true, data: activeLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
