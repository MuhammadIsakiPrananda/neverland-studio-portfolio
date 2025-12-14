// neverland-backend/controllers/twoFactorController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";
import crypto from "crypto";
import logger, { logAuthEvent, logSecurityEvent } from "../utils/logger.js";

/**
 * Generate recovery codes for 2FA
 * @returns {string[]} Array of 10 recovery codes
 */
const generateRecoveryCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    // Generate 8-character alphanumeric codes
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push(code);
  }
  return codes;
};

/**
 * Hash recovery codes for storage
 * @param {string[]} codes - Plain text recovery codes
 * @returns {Promise<string[]>} Hashed recovery codes
 */
const hashRecoveryCodes = async (codes) => {
  const hashedCodes = [];
  for (const code of codes) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(code, salt);
    hashedCodes.push(hashed);
  }
  return hashedCodes;
};

/**
 * @desc    Enable 2FA - Generate TOTP secret and return setup data
 * @route   POST /api/auth/2fa/enable
 * @access  Private
 */
export const enable2FA = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Check if 2FA is already enabled
    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        msg: "Two-factor authentication is already enabled",
      });
    }

    // Generate TOTP secret
    const totp = new OTPAuth.TOTP({
      issuer: "Neverland Studio",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: new OTPAuth.Secret(),
    });

    // Store secret temporarily (will be saved permanently after verification)
    // We'll use a temporary field or session storage
    // For simplicity, we'll return it to client and expect it back during verify
    const secret = totp.secret.base32;
    const otpauthUrl = totp.toString();

    logSecurityEvent("2FA_SETUP_INITIATED", {
      userId: user.id,
      email: user.email,
      ip: req.ip,
    });

    res.json({
      success: true,
      msg: "2FA setup initiated. Scan QR code with your authenticator app.",
      secret,
      otpauthUrl,
    });
  } catch (err) {
    logger.error("Enable 2FA error:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
    });
    next(err);
  }
};

/**
 * @desc    Verify 2FA code and activate 2FA
 * @route   POST /api/auth/2fa/verify
 * @access  Private
 */
export const verify2FA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { code, secret } = req.body;

    if (!code || !secret) {
      return res.status(400).json({
        success: false,
        msg: "Code and secret are required",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Create TOTP instance with provided secret
    const totp = new OTPAuth.TOTP({
      issuer: "Neverland Studio",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    // Validate the code (allow 1 window before/after for clock skew)
    const delta = totp.validate({ token: code, window: 1 });

    if (delta === null) {
      logSecurityEvent("2FA_VERIFICATION_FAILED", {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        msg: "Invalid verification code. Please try again.",
      });
    }

    // Generate recovery codes
    const recoveryCodes = generateRecoveryCodes();
    const hashedRecoveryCodes = await hashRecoveryCodes(recoveryCodes);

    // Save 2FA settings to database
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;
    user.twoFactorRecoveryCodes = hashedRecoveryCodes;
    await user.save();

    logAuthEvent("2FA_ENABLED", user.id, {
      email: user.email,
      ip: req.ip,
    });

    // Return recovery codes ONLY THIS ONCE
    res.json({
      success: true,
      msg: "Two-factor authentication has been successfully enabled.",
      recoveryCodes, // Plain text codes - only shown once
    });
  } catch (err) {
    logger.error("Verify 2FA error:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
    });
    next(err);
  }
};

/**
 * @desc    Disable 2FA
 * @route   POST /api/auth/2fa/disable
 * @access  Private
 */
export const disable2FA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        msg: "Password is required to disable 2FA",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        msg: "Two-factor authentication is not enabled",
      });
    }

    // Verify password for security
    if (!user.password) {
      return res.status(400).json({
        success: false,
        msg: "Cannot disable 2FA for OAuth accounts",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logSecurityEvent("2FA_DISABLE_WRONG_PASSWORD", {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        msg: "Invalid password",
      });
    }

    // Disable 2FA and clear related data
    user.twoFactorSecret = null;
    user.twoFactorEnabled = false;
    user.twoFactorRecoveryCodes = null;
    await user.save();

    logAuthEvent("2FA_DISABLED", user.id, {
      email: user.email,
      ip: req.ip,
    });

    res.json({
      success: true,
      msg: "Two-factor authentication has been disabled.",
    });
  } catch (err) {
    logger.error("Disable 2FA error:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
    });
    next(err);
  }
};

/**
 * @desc    Get recovery codes status (masked for security)
 * @route   GET /api/auth/2fa/recovery-codes
 * @access  Private
 */
export const getRecoveryCodes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        msg: "Two-factor authentication is not enabled",
      });
    }

    const recoveryCodesCount = user.twoFactorRecoveryCodes
      ? user.twoFactorRecoveryCodes.length
      : 0;

    res.json({
      success: true,
      count: recoveryCodesCount,
      msg: `You have ${recoveryCodesCount} recovery codes available.`,
    });
  } catch (err) {
    logger.error("Get recovery codes error:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
    });
    next(err);
  }
};

/**
 * @desc    Regenerate recovery codes
 * @route   POST /api/auth/2fa/recovery-codes/regenerate
 * @access  Private
 */
export const regenerateRecoveryCodes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        msg: "Password is required to regenerate recovery codes",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        msg: "Two-factor authentication is not enabled",
      });
    }

    // Verify password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        msg: "Cannot regenerate codes for OAuth accounts",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid password",
      });
    }

    // Generate new recovery codes
    const recoveryCodes = generateRecoveryCodes();
    const hashedRecoveryCodes = await hashRecoveryCodes(recoveryCodes);

    user.twoFactorRecoveryCodes = hashedRecoveryCodes;
    await user.save();

    logSecurityEvent("2FA_RECOVERY_CODES_REGENERATED", {
      userId: user.id,
      email: user.email,
      ip: req.ip,
    });

    res.json({
      success: true,
      msg: "Recovery codes have been regenerated.",
      recoveryCodes, // Plain text codes - only shown once
    });
  } catch (err) {
    logger.error("Regenerate recovery codes error:", {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
    });
    next(err);
  }
};

export default {
  enable2FA,
  verify2FA,
  disable2FA,
  getRecoveryCodes,
  regenerateRecoveryCodes,
};
