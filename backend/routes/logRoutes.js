import express from 'express';
import { getAllLogs, getOfficerLogs } from '../controllers/logController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllLogs);
router.get('/officer/:officerId', auth, getOfficerLogs);

export default router;
