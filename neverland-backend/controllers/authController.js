// controllers/authController.js - SECURE VERSION with enhanced validation
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import {
  validateRegistrationInput,
  validateLoginInput,
  sanitizeString
} from '../utils/validation.js';
import { verifyRecaptcha } from '../utils/recaptcha.js';
import { InternalError } from '../utils/errors.js';
import logger, { logAuthEvent, logSecurityEvent } from '../utils/logger.js';

// --- UTILS ---
const generateToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user.id,
        role: user.role // Hanya ID dan role untuk keamanan
      }
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generic error message to prevent user enumeration
const GENERIC_AUTH_ERROR = 'Invalid credentials';

/**
 * @desc    Register User
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    let { name, username, email, password, recaptchaToken } = req.body;

    // 1. Input Validation
    const validation = validateRegistrationInput({ name, username, email, password });
    if (!validation.isValid) {
      logSecurityEvent('REGISTRATION_VALIDATION_FAILED', {
        ip: req.ip,
        errors: validation.errors,
      });
      return res.status(400).json({
        success: false,
        msg: 'Invalid input',
        errors: validation.errors
      });
    }

    // 2. Sanitize inputs
    name = sanitizeString(name);
    username = sanitizeString(username).toLowerCase();
    email = sanitizeString(email).toLowerCase();

    // 3. Verify reCAPTCHA (Required in production)
    if (process.env.NODE_ENV === 'production' || recaptchaToken) {
      if (!recaptchaToken) {
        logSecurityEvent('REGISTRATION_MISSING_RECAPTCHA', {
          ip: req.ip,
          email,
        });
        return res.status(400).json({
          success: false,
          msg: 'Please complete the reCAPTCHA verification'
        });
      }

      try {
        await verifyRecaptcha(recaptchaToken);
      } catch (error) {
        logSecurityEvent('REGISTRATION_RECAPTCHA_FAILED', {
          ip: req.ip,
          email,
          error: error.message,
        });
        return res.status(400).json({
          success: false,
          msg: 'reCAPTCHA verification failed. Please try again.'
        });
      }
    }

    // 4. Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      },
    });

    if (existingUser) {
      logSecurityEvent('REGISTRATION_DUPLICATE_USER', {
        ip: req.ip,
        attemptedEmail: email,
        attemptedUsername: username,
      });

      // DON'T reveal which field is taken - prevents user enumeration
      return res.status(409).json({
        success: false,
        msg: 'An account with this email or username already exists'
      });
    }

    // 5. Hash password with high salt rounds
    const salt = await bcrypt.genSalt(12); // Higher work factor = more secure
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      provider: 'email',
      role: 'user',
      isVerified: true, // Auto-verify since no email verification system is implemented
      lastLogin: new Date()
    });

    logAuthEvent('USER_REGISTERED', user.id, {
      email: user.email,
      provider: 'email',
      ip: req.ip,
    });

    // 7. Generate JWT token
    const token = generateToken(user);

    // 8. Remove sensitive data from response
    const userResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
      provider: user.provider,
    };

    res.status(201).json({
      success: true,
      msg: 'Registration successful',
      token,
      user: userResponse
    });

  } catch (err) {
    logger.error('Registration error:', err);
    next(err);
  }
};

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    let { identifier, password } = req.body;

    // 1. Input validation
    const validation = validateLoginInput({ identifier, password });
    if (!validation.isValid) {
      logSecurityEvent('LOGIN_VALIDATION_FAILED', {
        ip: req.ip,
        identifier: identifier?.substring(0, 10) + '***', // Partial log only
      });
      return res.status(400).json({
        success: false,
        msg: 'Please provide valid credentials',
        errors: validation.errors
      });
    }

    identifier = sanitizeString(identifier).toLowerCase();

    // 2. Find user (including password for comparison)
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ],
      },
    });

    // 3. Check if user exists
    if (!user) {
      logSecurityEvent('LOGIN_USER_NOT_FOUND', {
        ip: req.ip,
        identifier: identifier?.substring(0, 10) + '***',
      });

      // Use generic message to prevent user enumeration
      return res.status(401).json({
        success: false,
        msg: GENERIC_AUTH_ERROR
      });
    }

    // 4. Check if user registered via OAuth (no password)
    if (!user.password) {
      logSecurityEvent('LOGIN_OAUTH_USER_ATTEMPTED_PASSWORD', {
        ip: req.ip,
        userId: user.id,
        provider: user.provider,
      });

      return res.status(400).json({
        success: false,
        msg: `This account uses ${user.provider} login. Please sign in with ${user.provider}.`
      });
    }

    // 5. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logSecurityEvent('LOGIN_INVALID_PASSWORD', {
        ip: req.ip,
        userId: user.id,
        email: user.email,
      });

      // Use generic message to prevent user enumeration
      return res.status(401).json({
        success: false,
        msg: GENERIC_AUTH_ERROR
      });
    }

    // NOTE: Email verification check removed - no email verification system implemented.
    // TODO: Re-enable this check when email verification is implemented.
    // if (!user.isVerified) {
    //   logSecurityEvent('LOGIN_UNVERIFIED_ACCOUNT', { ip: req.ip, userId: user.id });
    //   return res.status(403).json({ success: false, msg: 'Account not verified.' });
    // }

    // 6. Update last login
    user.lastLogin = new Date();
    await user.save();

    logAuthEvent('USER_LOGIN_SUCCESS', user.id, {
      email: user.email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // 7. Generate token
    const token = generateToken(user);

    // 8. Remove sensitive data from response
    const userResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
      provider: user.provider,
    };

    res.json({
      success: true,
      msg: 'Login successful',
      token,
      user: userResponse
    });

  } catch (err) {
    logger.error('Login error:', err);
    next(err);
  }
};

/**
 * @desc    Logout User (client-side token deletion mainly)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      logAuthEvent('USER_LOGOUT', req.user.id, {
        ip: req.ip,
      });
    }

    // For JWT, logout is handled client-side by removing token
    // You could implement token blacklist here if needed

    res.json({
      success: true,
      msg: 'Logged out successfully'
    });
  } catch (err) {
    logger.error('Logout error:', err);
    next(err);
  }
};

/**
 * @desc    Refresh Token
 * @route   POST /api/auth/refresh
 * @access  Private
 */
export const refreshToken = async (req, res, next) => {
  try {
    // Verify current token is valid
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid token'
      });
    }

    // Find user to ensure they still exist
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'User no longer exists'
      });
    }

    // Generate new token
    const token = generateToken(user);

    logAuthEvent('TOKEN_REFRESHED', user.id, {
      ip: req.ip,
    });

    res.json({
      success: true,
      token
    });
  } catch (err) {
    logger.error('Token refresh error:', err);
    next(err);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
};