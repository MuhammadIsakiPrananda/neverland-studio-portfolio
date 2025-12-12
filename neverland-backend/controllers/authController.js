// controllers/authController.js - SECURE VERSION with enhanced validation
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import {
  validateRegistrationInput,
  validateLoginInput,
  sanitizeString,
} from "../utils/validation.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";
import { InternalError } from "../utils/errors.js";
import logger, { logAuthEvent, logSecurityEvent } from "../utils/logger.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/emailService.js";

// --- UTILS ---
const generateToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user.id,
        role: user.role, // Hanya ID dan role untuk keamanan
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// Generic error message to prevent user enumeration
const GENERIC_AUTH_ERROR = "Invalid credentials";

/**
 * @desc    Register User
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    let { name, username, email, password, recaptchaToken } = req.body;

    // 1. Input Validation
    const validation = validateRegistrationInput({
      name,
      username,
      email,
      password,
    });
    if (!validation.isValid) {
      logSecurityEvent("REGISTRATION_VALIDATION_FAILED", {
        ip: req.ip,
        errors: validation.errors,
      });
      return res.status(400).json({
        success: false,
        msg: "Invalid input",
        errors: validation.errors,
      });
    }

    // 2. Sanitize inputs
    name = sanitizeString(name);
    username = sanitizeString(username).toLowerCase();
    email = sanitizeString(email).toLowerCase();

    // 3. Verify reCAPTCHA (Optional - only if token is provided)
    if (recaptchaToken) {
      try {
        await verifyRecaptcha(recaptchaToken);
      } catch (error) {
        logSecurityEvent("REGISTRATION_RECAPTCHA_FAILED", {
          ip: req.ip,
          email,
          error: error.message,
        });
        return res.status(400).json({
          success: false,
          msg: "reCAPTCHA verification failed. Please try again.",
        });
      }
    }

    // 4. Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      logSecurityEvent("REGISTRATION_DUPLICATE_USER", {
        ip: req.ip,
        attemptedEmail: email,
        attemptedUsername: username,
      });

      // DON'T reveal which field is taken - prevents user enumeration
      return res.status(409).json({
        success: false,
        msg: "An account with this email or username already exists",
      });
    }

    // 5. Hash password with high salt rounds
    const salt = await bcrypt.genSalt(12); // Higher work factor = more secure
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create user
    // Set username_changes_count to 0 and username_changes_month to current month (1-12)
    const now = new Date();
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      provider: "email",
      role: "user",
      isVerified: true, // Auto-verify for immediate login capability
      lastLogin: now,
      username_changes_count: 0,
      username_changes_month: now.getMonth() + 1, // JS months are 0-based
    });

    logAuthEvent("USER_REGISTERED", user.id, {
      email: user.email,
      provider: "email",
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
      isVerified: user.isVerified,
    };

    res.status(201).json({
      success: true,
      msg: "Registration successful! You are now logged in.",
      token,
      user: userResponse,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (err) {
    logger.error("Registration error:", {
      error: err.message,
      stack: err.stack,
      ip: req.ip,
    });

    // Return more helpful error in development
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({
        success: false,
        msg: "Registration failed",
        error: err.message,
      });
    }

    next(err);
  }
};

/**
 * @desc    Login User - PRODUCTION READY
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  const startTime = Date.now();

  try {
    let { identifier, password, recaptchaToken } = req.body;

    // 1. Input validation
    const validation = validateLoginInput({ identifier, password });
    if (!validation.isValid) {
      logSecurityEvent("LOGIN_VALIDATION_FAILED", {
        ip: req.ip,
        identifier: identifier?.substring(0, 5) + "***",
        userAgent: req.get("user-agent"),
      });
      return res.status(400).json({
        success: false,
        msg: "Please provide valid credentials",
        errors: validation.errors,
      });
    }

    // 2. reCAPTCHA verification (Optional - only if token is provided)
    if (recaptchaToken) {
      try {
        await verifyRecaptcha(recaptchaToken);
      } catch (error) {
        logSecurityEvent("LOGIN_RECAPTCHA_FAILED", {
          ip: req.ip,
          error: error.message,
        });
        return res.status(400).json({
          success: false,
          msg: "Security verification failed. Please try again.",
        });
      }
    }

    identifier = sanitizeString(identifier).toLowerCase();

    // 2. Find user (including password for comparison)
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    // 3. Check if user exists
    if (!user) {
      logSecurityEvent("LOGIN_USER_NOT_FOUND", {
        ip: req.ip,
        identifier: identifier?.substring(0, 10) + "***",
      });

      // Use generic message to prevent user enumeration
      return res.status(401).json({
        success: false,
        msg: GENERIC_AUTH_ERROR,
      });
    }

    // 4. Check if user registered via OAuth (no password)
    if (!user.password) {
      logSecurityEvent("LOGIN_OAUTH_USER_ATTEMPTED_PASSWORD", {
        ip: req.ip,
        userId: user.id,
        provider: user.provider,
      });

      return res.status(400).json({
        success: false,
        msg: `This account uses ${user.provider} login. Please sign in with ${user.provider}.`,
      });
    }

    // 5. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logSecurityEvent("LOGIN_INVALID_PASSWORD", {
        ip: req.ip,
        userId: user.id,
        email: user.email,
      });

      // Use generic message to prevent user enumeration
      return res.status(401).json({
        success: false,
        msg: GENERIC_AUTH_ERROR,
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

    logAuthEvent("USER_LOGIN_SUCCESS", user.id, {
      email: user.email,
      ip: req.ip,
      userAgent: req.get("user-agent"),
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
      isVerified: user.isVerified,
    };

    // 9. Log response time for monitoring
    const responseTime = Date.now() - startTime;
    logger.info(`Login successful for user ${user.id}`, {
      userId: user.id,
      email: user.email,
      ip: req.ip,
      responseTime: `${responseTime}ms`,
    });

    res.json({
      success: true,
      msg: "Login successful! Welcome back.",
      token,
      user: userResponse,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (err) {
    const responseTime = Date.now() - startTime;
    logger.error("Login error:", {
      error: err.message,
      stack: err.stack,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
    });
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
      logAuthEvent("USER_LOGOUT", req.user.id, {
        ip: req.ip,
      });
    }

    // For JWT, logout is handled client-side by removing token
    // You could implement token blacklist here if needed

    res.json({
      success: true,
      msg: "Logged out successfully",
    });
  } catch (err) {
    logger.error("Logout error:", err);
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
        msg: "Invalid token",
      });
    }

    // Find user to ensure they still exist
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User no longer exists",
      });
    }

    // Generate new token
    const token = generateToken(user);

    logAuthEvent("TOKEN_REFRESHED", user.id, {
      ip: req.ip,
    });

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    logger.error("Token refresh error:", err);
    next(err);
  }
};

/**
 * @desc    Request Password Reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;

    // 1. Validate email input
    if (!email || typeof email !== "string") {
      logSecurityEvent("FORGOT_PASSWORD_INVALID_EMAIL", {
        ip: req.ip,
      });
      return res.status(400).json({
        success: false,
        msg: "Please provide a valid email address.",
      });
    }

    // 2. Sanitize email
    email = sanitizeString(email).toLowerCase();

    // 3. Find user by email
    const user = await User.findOne({
      where: { email },
    });

    // 4. Always return generic message to prevent user enumeration
    if (!user) {
      logSecurityEvent("FORGOT_PASSWORD_USER_NOT_FOUND", {
        ip: req.ip,
        email: email.substring(0, 5) + "***",
      });

      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        success: true,
        msg: "If an account exists with this email, you will receive a password reset link shortly.",
      });
    }

    // 5. Generate reset token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 6. Set reset token and expiration (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    logSecurityEvent("FORGOT_PASSWORD_TOKEN_GENERATED", {
      ip: req.ip,
      userId: user.id,
      email: user.email.substring(0, 5) + "***",
    });

    // 7. Send email
    try {
      await sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken,
        process.env.FRONTEND_URL
      );

      logAuthEvent("PASSWORD_RESET_EMAIL_SENT", user.id, {
        email: user.email.substring(0, 5) + "***",
        ip: req.ip,
      });
    } catch (emailError) {
      // Clear the reset token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      logger.error("Failed to send password reset email", {
        userId: user.id,
        email: user.email,
        error: emailError.message,
      });

      return res.status(500).json({
        success: false,
        msg: "Failed to send reset email. Please try again later.",
      });
    }

    // 8. Return generic success message
    res.status(200).json({
      success: true,
      msg: "If an account exists with this email, you will receive a password reset link shortly.",
    });
  } catch (err) {
    logger.error("Forgot password error:", {
      error: err.message,
      stack: err.stack,
      ip: req.ip,
    });
    next(err);
  }
};

/**
 * @desc    Reset Password with Token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    let { token, password, confirmPassword } = req.body;

    // 1. Validate inputs
    if (!token || typeof token !== "string") {
      logSecurityEvent("RESET_PASSWORD_INVALID_TOKEN", {
        ip: req.ip,
      });
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired reset token.",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "Please provide both password and confirm password.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "Passwords do not match.",
      });
    }

    // 2. Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 8 characters long.",
      });
    }

    // 3. Hash provided token and find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(), // Token must not be expired
        },
      },
    });

    // 4. Check if user found and token is valid
    if (!user) {
      logSecurityEvent("RESET_PASSWORD_INVALID_OR_EXPIRED_TOKEN", {
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        msg: "Password reset token is invalid or has expired.",
      });
    }

    // 5. Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    logAuthEvent("PASSWORD_RESET_SUCCESSFUL", user.id, {
      email: user.email,
      ip: req.ip,
    });

    res.status(200).json({
      success: true,
      msg: "Your password has been reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    logger.error("Reset password error:", {
      error: err.message,
      stack: err.stack,
      ip: req.ip,
    });
    next(err);
  }
};

/**
 * @desc    Verify Reset Token
 * @route   POST /api/auth/verify-reset-token
 * @access  Public
 */
export const verifyResetToken = async (req, res, next) => {
  try {
    let { token } = req.body;

    // 1. Validate token
    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        msg: "Invalid token.",
      });
    }

    // 2. Hash token and find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    // 3. Return result
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired reset token.",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Token is valid.",
      valid: true,
    });
  } catch (err) {
    logger.error("Verify reset token error:", {
      error: err.message,
      stack: err.stack,
      ip: req.ip,
    });
    next(err);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
