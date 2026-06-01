import express from 'express';
import { registerOfficer, getOfficers, getOfficerById, updateOfficer, deleteOfficer } from '../controllers/officerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerOfficer);
router.get('/', auth, getOfficers);
router.get('/:id', auth, getOfficerById);
router.put('/:id', auth, updateOfficer);
router.delete('/:id', auth, deleteOfficer);

export default router;
