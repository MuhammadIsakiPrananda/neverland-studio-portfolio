// routes/authGithub.js - GitHub OAuth Routes
import express from "express";
import passport from "passport";
import generateToken from "../utils/generateToken.js";
import {
  getOAuthCallbackUrlFromRequest,
  getSuccessRedirectUrlFromRequest,
  getErrorRedirectUrlFromRequest,
} from "../utils/urlConfig.js";
import logger, { logAuthEvent } from "../utils/logger.js";

const router = express.Router();

// @desc    Auth with GitHub
// @route   GET /api/auth/github
router.get("/", (req, res, next) => {
  // Access the strategy instance to dynamically set the callback URL.
  const strategy = passport._strategy("github");
  const callbackURL = getOAuthCallbackUrlFromRequest(req, "github");
  logger.info(
    `Initiating GitHub authentication. Using callback URL: ${callbackURL}`
  );

  // Dynamically set the callback URL for this authentication request.
  strategy._oauth2._callbackURL = callbackURL;
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

// @desc    GitHub auth callback
// @route   GET /api/auth/github/callback
router.get("/callback", (req, res, next) => {
  const strategy = passport._strategy("github");
  const callbackURL = getOAuthCallbackUrlFromRequest(req, "github");
  // Ensure the callback URL is consistent with the one used during initiation.
  strategy._oauth2._callbackURL = callbackURL;

  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      logger.error("GitHub OAuth callback error.", {
        error: err.message,
        stack: err.stack,
        ip: req.ip,
      });
      return res.redirect(
        getErrorRedirectUrlFromRequest(req, "auth_error", err.message)
      );
    }
    if (!user) {
      logger.warn("GitHub OAuth Failed:", {
        message: info?.message || "No user returned",
      });
      return res.redirect(
        getErrorRedirectUrlFromRequest(
          req,
          "auth_failed",
          info?.message || "Authentication failed"
        )
      );
    }

    try {
      const token = generateToken(user);

      // User data to be sent to the frontend.
      const userData = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        provider: user.provider,
      };

      // Log the successful authentication event for auditing.
      logAuthEvent("GITHUB_LOGIN_SUCCESS", user.id, { ip: req.ip });

      res.redirect(getSuccessRedirectUrlFromRequest(req, token, userData));
    } catch (error) {
      logger.error("Error in GitHub OAuth callback handler.", {
        error: error.message,
        stack: error.stack,
      });
      return res.redirect(
        getErrorRedirectUrlFromRequest(
          req,
          "token_error",
          "Failed to process authentication."
        )
      );
    }
  })(req, res, next);
});

export default router;
