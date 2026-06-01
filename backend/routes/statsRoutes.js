import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getDashboardStats);

export default router;
