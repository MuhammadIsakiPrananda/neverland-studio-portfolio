import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  setup2FA,
  verify2FA,
  download2FARecovery,
} from "../controllers/authController.js";
// --- 2FA ROUTES (require auth middleware) ---
import { requireAuth } from "../middleware/authMiddleware.js";
router.post("/2fa/setup", requireAuth, setup2FA);
router.post("/2fa/verify", requireAuth, verify2FA);
router.get("/2fa/recovery", requireAuth, download2FARecovery);
import deleteHandler from "./delete.js";
import generateToken from "../utils/generateToken.js";
import {
  getSuccessRedirectUrlFromRequest,
  getErrorRedirectUrlFromRequest,
} from "../utils/urlConfig.js";
import logger, { logAuthEvent } from "../utils/logger.js";
import githubAuthRouter from "./authGithub.js";

const router = express.Router();

// --- Local Authentication Routes (Email/Password) ---
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);
router.delete("/delete", deleteHandler); // Auth middleware is included within the handler

// --- Google Authentication Routes ---

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureMessage: true }),
  (req, res) => {
    // This function is only called on successful authentication.
    // `req.user` is populated by the Passport strategy.
    try {
      const user = req.user;
      const token = generateToken(user);

      // Prepare public user data to send to the frontend.
      const publicUserData = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        provider: user.provider,
      };

      // Log the successful authentication event for auditing.
      logAuthEvent("GOOGLE_LOGIN_SUCCESS", user.id, { ip: req.ip });

      // Redirect to the frontend with the token and user data.
      const successRedirectUrl = getSuccessRedirectUrlFromRequest(
        req,
        token,
        publicUserData
      );
      res.redirect(successRedirectUrl);
    } catch (error) {
      logger.error("Error in Google OAuth callback handler.", {
        error: error.message,
        stack: error.stack,
      });
      const errorRedirectUrl = getErrorRedirectUrlFromRequest(
        req,
        "token_error",
        "Failed to process authentication."
      );
      res.redirect(errorRedirectUrl);
    }
  }
);

// --- GitHub Authentication Routes ---
router.use("/github", githubAuthRouter);

export default router;
