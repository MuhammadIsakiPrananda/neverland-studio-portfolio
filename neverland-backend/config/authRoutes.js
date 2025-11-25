import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

export default router;