// routes/config.js - Public configuration endpoints
import { Router } from "express";
import {
  getAllPublicConfigs,
  getAuthEndpoints,
  getGithubConfig,
  getGoogleConfig,
  getRecaptchaConfig,
  getServerConfig,
} from "../controllers/configController.js";

const router = Router();

// @route   GET /api/config/all
// @desc    Get all public configurations for the frontend
router.get("/all", getAllPublicConfigs);

// @route   GET /api/config/server
// @desc    Get server configuration
router.get("/server", getServerConfig);

// @route   GET /api/config/recaptcha
// @desc    Get reCAPTCHA site key
router.get("/recaptcha", getRecaptchaConfig);

// @route   GET /api/config/google
// @desc    Get Google OAuth client ID
router.get("/google", getGoogleConfig);

// @route   GET /api/config/github
// @desc    Get GitHub OAuth Client ID
router.get("/github", getGithubConfig);

// @route   GET /api/config/auth
// @desc    Get authentication endpoints information
router.get("/auth", getAuthEndpoints);

export default router;
