import express from 'express';
import { registerOwner, getOwners, getOwnerById, updateOwner, deleteOwner } from '../controllers/ownerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerOwner);
router.get('/', auth, getOwners);
router.get('/:id', auth, getOwnerById);
router.put('/:id', auth, updateOwner);
router.delete('/:id', auth, deleteOwner);

export default router;
