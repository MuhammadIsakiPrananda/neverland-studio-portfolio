import express from 'express';
import { verifyToken } from '../config/auth.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Endpoint to get the profile of the currently authenticated user
router.get('/me', verifyToken, async (req, res) => {
  try {
    // The user ID is attached to `req.user` by the `verifyToken` middleware
    const user = await User.findByPk(req.user.id, {
      // Explicitly select which attributes to send back for security
      attributes: ['id', 'name', 'username', 'email', 'image', 'role', 'provider', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found.' });
    }

    // Send back the user's public profile data
    res.json({ success: true, user });
  } catch (error) {
    logger.error(`Error fetching user profile for user ID ${req.user.id}:`, error);
    res.status(500).json({ success: false, msg: 'Server error while fetching user profile.' });
  }
});

export default router;