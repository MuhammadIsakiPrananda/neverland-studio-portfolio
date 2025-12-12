// controllers/userController.js
import User from '../models/User.js'; //
import bcrypt from 'bcryptjs';
import { sanitizeString, isValidUsername } from '../utils/validation.js';
import logger from '../utils/logger.js';
import dayjs from 'dayjs';

// Helper untuk memformat respons pengguna, memastikan tidak ada data sensitif yang bocor.
const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email, // Hanya untuk pengguna yang sedang login
    bio: user.bio,
    image: user.image,
    provider: user.provider,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
  };
};

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private (Protected)
const getCurrentUser = async (req, res, next) => {
  try {
    // req.user.id berasal dari middleware auth (verifyToken)
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (err) {
    logger.error('Get current user error:', err);
    next(err);
  }
};

// @desc    Get user profile by username (public)
// @route   GET /api/user/profile/:username
// @access  Public
const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ success: false, msg: 'Username is required' });
    }

    const user = await User.findOne({
      where: { username: username.toLowerCase() },
      attributes: { exclude: ['password', 'email', 'googleId', 'githubId'] }, // Hide sensitive data
    });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    logger.error('Get user by username error:', err);
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private (Protected)
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Hanya izinkan field yang aman untuk diperbarui
    const { name, bio } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Validasi dan sanitasi input
    if (name !== undefined) {
      const sanitizedName = sanitizeString(name);
      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        return res.status(400).json({ success: false, msg: 'Name must be between 2 and 100 characters' });
      }
      user.name = sanitizedName;
    }

    if (bio !== undefined) {
      const sanitizedBio = sanitizeString(bio); // Sanitasi juga bisa membatasi panjang
      if (sanitizedBio.length > 500) {
        return res.status(400).json({ success: false, msg: 'Bio must not exceed 500 characters' });
      }
      user.bio = sanitizedBio;
    }

    await user.save();

    res.json({
      success: true,
      msg: 'Profile updated successfully',
      user: formatUserResponse(user),
    });
  } catch (err) {
    logger.error('Update profile error:', err);
    next(err);
  }
};

// @desc    Change user password
// @route   PUT /api/user/change-password
// @access  Private (Protected)
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, msg: 'Current password and new password are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
// @desc    Update username (max 3x per month)
// @route   PUT /api/user/username
// @access  Private (Protected)
const updateUsername = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, msg: 'Username is required' });
    }
    const sanitizedUsername = sanitizeString(username.toLowerCase());
    if (!isValidUsername(sanitizedUsername)) {
      return res.status(400).json({ success: false, msg: 'Invalid username format' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    if (user.username === sanitizedUsername) {
      return res.status(400).json({ success: false, msg: 'Username is the same as current' });
    }
    const existing = await User.findOne({ where: { username: sanitizedUsername } });
    if (existing) {
      return res.status(400).json({ success: false, msg: 'Username already taken' });
    }
    // Hitung bulan sekarang (format: YYYYMM)
    const nowMonth = parseInt(dayjs().format('YYYYMM'));
    // Reset count jika bulan sudah berganti
    if (user.username_changes_month !== nowMonth) {
      user.username_changes_month = nowMonth;
      user.username_changes_count = 0;
    }
    if (user.username_changes_count >= 3) {
      return res.status(429).json({ success: false, msg: 'Username can only be changed 3 times per month' });
    }
    user.username = sanitizedUsername;
    user.username_changes_count += 1;
    user.username_changes_month = nowMonth;
    await user.save();
    res.json({ success: true, msg: 'Username updated successfully', user: { username: user.username, username_changes_count: user.username_changes_count } });
  } catch (err) {
    logger.error('Update username error:', err);
    next(err);
  }
};
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Cek jika user terdaftar via Google/GitHub (biasanya tidak punya password)
    if ((user.provider === 'google' || user.provider === 'github') && !user.password) {
      return res.status(400).json({ success: false, msg: `This account uses ${user.provider} login and does not have a password to change.` });
    }

    // Validasi password lama
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, msg: 'Current password is incorrect' });
    }

    // Validasi password baru
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, msg: 'New password must be at least 8 characters long' });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      msg: 'Password changed successfully',
    });
  } catch (err) {
    logger.error('Change password error:', err);
    next(err);
  }
};

module.exports = {
  getCurrentUser,
  getUserByUsername,
  updateProfile,
  changePassword,
  updateUsername
};