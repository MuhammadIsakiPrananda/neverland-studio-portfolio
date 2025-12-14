import express from "express";
import { verifyToken } from "../config/auth.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { updateProfile, getProfile } from "../controllers/profileController.js";
import { changePassword } from "../controllers/userController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

// Endpoint to get the profile of the currently authenticated user
router.get("/me", verifyToken, async (req, res) => {
  try {
    // The user ID is attached to `req.user` by the `verifyToken` middleware
    const user = await User.findByPk(req.user.id, {
      // Explicitly select which attributes to send back for security
      attributes: [
        "id",
        "name",
        "username",
        "email",
        "image",
        "role",
        "provider",
        "createdAt",
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    // Send back the user's public profile data
    res.json({ success: true, user });
  } catch (error) {
    logger.error(
      `Error fetching user profile for user ID ${req.user.id}:`,
      error
    );
    res
      .status(500)
      .json({
        success: false,
        msg: "Server error while fetching user profile.",
      });
  }
});

// Profile Management Routes
// @desc    Get user profile with username change info
// @route   GET /api/user/profile
// @access  Private
router.get("/profile", authenticate, getProfile);

// @desc    Update user profile (name, username, bio, image)
// @route   PUT /api/user/profile
// @access  Private
router.put("/profile", authenticate, updateProfile);

// @desc    Change user password
// @route   PUT /api/user/change-password
// @access  Private
router.put("/change-password", authenticate, changePassword);

export default router;
