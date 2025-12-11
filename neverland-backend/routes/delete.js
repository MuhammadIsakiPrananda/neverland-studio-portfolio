import User from "../models/User.js";
import { verifyToken } from "../utils/generateToken.js";
import logger, { logAuthEvent, logSecurityEvent } from "../utils/logger.js";

/**
 * @desc    Delete User Account
 * @route   DELETE /api/auth/delete
 * @access  Private (requires valid JWT token)
 */
const deleteAccount = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logSecurityEvent("DELETE_ACCOUNT_NO_TOKEN", {
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        msg: "Authorization token required",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      logSecurityEvent("DELETE_ACCOUNT_INVALID_TOKEN", {
        ip: req.ip,
        error: error.message,
      });
      return res.status(401).json({
        success: false,
        msg: "Invalid or expired token",
      });
    }

    // Get user ID from token
    const userId = decoded.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      logSecurityEvent("DELETE_ACCOUNT_USER_NOT_FOUND", {
        ip: req.ip,
        userId,
      });
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Store user info for logging before deletion
    const userEmail = user.email;
    const userName = user.name;

    // Delete the user
    await user.destroy();

    // Log successful deletion
    logAuthEvent("ACCOUNT_DELETED", userId, {
      email: userEmail,
      name: userName,
      ip: req.ip,
    });

    logger.info(`User account deleted successfully: ${userEmail}`);

    return res.status(200).json({
      success: true,
      msg: "Account deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting user account:", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      msg: "Server error while deleting account",
    });
  }
};

export default deleteAccount;
