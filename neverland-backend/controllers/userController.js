// controllers/userController.js - User management endpoints
import User from '../models/User.js';
import { verifyJWT } from '../config/auth.js';
import { NotFoundError } from '../utils/errors.js';

// @desc    Get current user profile
// @route   GET /api/user/profile
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({
      success: false,
      msg: 'An error occurred while fetching user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, bio } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    // Update hanya fields yang diizinkan
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      success: true,
      msg: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({
      success: false,
      msg: 'An error occurred while updating profile',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/user/account
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    await user.destroy();

    res.json({
      success: true,
      msg: 'Account deleted successfully',
    });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({
      success: false,
      msg: 'An error occurred while deleting account',
    });
  }
};
