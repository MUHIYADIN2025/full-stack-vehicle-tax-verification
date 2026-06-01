import Checkpoint from '../models/Checkpoint.js';

export const createCheckpoint = async (req, res) => {
  try {
    const { name, location } = req.body;
    const checkpoint = new Checkpoint({ name, location });
    await checkpoint.save();
    res.status(201).json({ success: true, data: checkpoint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCheckpoints = async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find();
    res.status(200).json({ success: true, data: checkpoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findByIdAndDelete(req.params.id);
    if (!checkpoint) return res.status(404).json({ success: false, message: 'Checkpoint not found' });
    res.status(200).json({ success: true, message: 'Checkpoint deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
