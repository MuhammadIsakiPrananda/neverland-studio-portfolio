// config/userRoutes.js
import { Router } from 'express';
import { getCurrentUser, updateProfile, deleteAccount } from '../controllers/userController.js';
import { verifyJWT } from './auth.js';

const router = Router();

// Semua route user memerlukan authentikasi
router.use(verifyJWT);

// @route   GET /api/user/profile
router.get('/profile', getCurrentUser);

// @route   PUT /api/user/profile
router.put('/profile', updateProfile);

// @route   DELETE /api/user/account
router.delete('/account', deleteAccount);

export default router;
