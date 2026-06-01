import express from 'express';
import { createCheckpoint, getCheckpoints, deleteCheckpoint } from '../controllers/checkpointController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createCheckpoint);
router.get('/', auth, getCheckpoints);
router.delete('/:id', auth, deleteCheckpoint);

export default router;
