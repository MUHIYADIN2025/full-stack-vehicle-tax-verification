import express from 'express';
import {
  registerVehicle,
  getVehicles,
  getVehicleById,
  getVehicleByPlate,
  getVehiclesByOwner,
  updateVehicle,
  deleteVehicle,
  verifyVehicle
} from '../controllers/vehicleController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', auth, registerVehicle);
router.get('/', auth, getVehicles);
router.post('/verify', verifyVehicle);
router.get('/plate/:plateNumber', getVehicleByPlate);
router.get('/owner/:ownerId', auth, getVehiclesByOwner);
router.get('/:id', auth, getVehicleById);
router.put('/:id', auth, updateVehicle);
router.delete('/:id', auth, deleteVehicle);

export default router;
