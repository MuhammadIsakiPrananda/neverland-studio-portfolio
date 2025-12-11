// controllers/configController.js - Configuration & Public endpoints
import { getBackendUrl, getFrontendUrl } from "../utils/urlConfig.js";

/**
 * @desc    Get server configuration
 * @route   GET /api/config/server
 * @access  Public
 *
 * Returns public configuration information about the server
 */
export const getServerConfig = async (req, res, next) => {
  try {
    const config = {
      success: true,
      data: {
        appName: "Neverland Studio",
        version: "1.0.0",
        apiVersion: "v1",
        environment: process.env.NODE_ENV || "development",
        backendUrl: getBackendUrl(),
        frontendUrl: getFrontendUrl(),
        features: {
          authentication: true,
          googleOAuth:
            !!process.env.GOOGLE_CLIENT_ID &&
            !!process.env.GOOGLE_CLIENT_SECRET,
          githubOAuth:
            !!process.env.GITHUB_CLIENT_ID &&
            !!process.env.GITHUB_CLIENT_SECRET,
          recaptcha: !!process.env.RECAPTCHA_SECRET_KEY,
          emailVerification: false,
          twoFactorAuth: false,
        },
        limits: {
          maxPayloadSize: "10KB",
          sessionTimeout: "7 days",
          passwordMinLength: 8,
        },
      },
    };

    res.json(config);
  } catch (err) {
    console.error("Get config error:", err.message);
    res.status(500).json({
      success: false,
      msg: "An error occurred while fetching configuration",
    });
  }
};

/**
 * @desc    Get all public configurations
 * @route   GET /api/config/all
 * @access  Public
 *
 * Returns all public configurations needed by the frontend in a single request.
 */
export const getAllPublicConfigs = async (req, res, next) => {
  try {
    const configs = {
      success: true,
      data: {
        appName: "Neverland Studio",
        version: "1.0.0",
        apiVersion: "v1",
        environment: process.env.NODE_ENV || "development",
        backendUrl: getBackendUrl(),
        frontendUrl: getFrontendUrl(),
        auth: {
          google: {
            enabled:
              !!process.env.GOOGLE_CLIENT_ID &&
              !!process.env.GOOGLE_CLIENT_SECRET,
            clientId: process.env.GOOGLE_CLIENT_ID || null,
          },
          github: {
            enabled:
              !!process.env.GITHUB_CLIENT_ID &&
              !!process.env.GITHUB_CLIENT_SECRET,
            clientId: process.env.GITHUB_CLIENT_ID || null,
          },
          recaptcha: {
            enabled: !!process.env.RECAPTCHA_SECRET_KEY,
            siteKey: process.env.RECAPTCHA_SITE_KEY || null,
          },
        },
      },
    };

    res.json(configs);
  } catch (err) {
    console.error("Get all public configs error:", err.message);
    res.status(500).json({
      success: false,
      msg: "An error occurred while fetching all public configurations",
    });
  }
};

/**
 * @desc    Get reCAPTCHA site key
 * @route   GET /api/config/recaptcha
 * @access  Public
 */
export const getRecaptchaConfig = async (req, res, next) => {
  try {
    const siteKey = process.env.RECAPTCHA_SITE_KEY;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    console.log("📝 reCAPTCHA config requested:", {
      hasSiteKey: !!siteKey,
      hasSecretKey: !!secretKey,
      siteKeyValue: siteKey || "NOT_SET",
      origin: req.get("origin"),
      ip: req.ip,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!siteKey) {
      console.error(
        "❌ ERROR: RECAPTCHA_SITE_KEY is missing in environment variables!"
      );
      console.error("Environment check:", {
        allEnvKeys: Object.keys(process.env).filter((k) =>
          k.includes("RECAPTCHA")
        ),
      });
      return res.status(500).json({
        success: false,
        msg: "reCAPTCHA configuration missing on server",
        error: "RECAPTCHA_SITE_KEY not found in environment",
      });
    }

    // Set explicit CORS headers
    const origin = req.get("origin");
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    console.log(
      "✅ Sending reCAPTCHA site key:",
      siteKey.substring(0, 20) + "..."
    );

    res.json({
      success: true,
      siteKey: siteKey,
      enabled: true,
    });
  } catch (err) {
    console.error("Get reCAPTCHA config error:", err.message);
    res.status(500).json({
      success: false,
      msg: "Server error retrieving configuration",
    });
  }
};

/**
 * @desc    Get Google OAuth client ID
 * @route   GET /api/config/google
 * @access  Public
 *
 * Returns Google OAuth client ID untuk frontend
 */
export const getGoogleConfig = async (req, res, next) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return res.status(500).json({
        success: false,
        msg: "Google OAuth is not configured on server",
      });
    }

    res.json({
      success: true,
      clientId,
    });
  } catch (err) {
    console.error("Get Google config error:", err.message);
    res.status(500).json({
      success: false,
      msg: "An error occurred while fetching Google configuration",
    });
  }
};

/**
 * @desc    Get GitHub OAuth client ID
 * @route   GET /api/config/github
 * @access  Public
 *
 * Returns GitHub OAuth client ID untuk frontend
 */
export const getGithubConfig = async (req, res, next) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
      return res.status(500).json({
        success: false,
        msg: "GitHub OAuth is not configured on server",
      });
    }

    res.json({
      success: true,
      clientId,
    });
  } catch (err) {
    console.error("Get GitHub config error:", err.message);
    res.status(500).json({
      success: false,
      msg: "An error occurred while fetching GitHub configuration",
    });
  }
};
/**
 * @desc    Get authentication endpoints info
 * @route   GET /api/config/auth
 * @access  Public
 *
 * Returns information tentang authentication endpoints yang tersedia
 */
export const getAuthEndpoints = async (req, res, next) => {
  try {
    const endpoints = {
      success: true,
      endpoints: {
        register: {
          method: "POST",
          path: "/api/auth/register",
          description: "Register user dengan email dan password",
          requires: ["name", "username", "email", "password", "recaptchaToken"],
        },
        login: {
          method: "POST",
          path: "/api/auth/login",
          description:
            "Login dengan email/username dan password (reCAPTCHA tidak diperlukan)",
          requires: ["identifier", "password"],
        },
        googleLogin: {
          method: "GET",
          path: "/api/auth/google",
          description: "Login dengan Google OAuth",
        },
        googleCallback: {
          method: "GET",
          path: "/api/auth/google/callback",
          description: "Google OAuth callback (automatic redirect)",
        },
        githubLogin: {
          method: "GET",
          path: "/api/auth/github",
          description: "Login dengan GitHub OAuth",
        },
        githubCallback: {
          method: "GET",
          path: "/api/auth/github/callback",
          description: "GitHub OAuth callback (automatic redirect)",
        },
        logout: {
          method: "POST",
          path: "/api/auth/logout",
          description: "Logout user (requires authentication token)",
        },
        refreshToken: {
          method: "POST",
          path: "/api/auth/refresh",
          description: "Refresh JWT token (requires authentication token)",
        },
      },
    };

    res.json(endpoints);
  } catch (err) {
    console.error("Get auth endpoints error:", err.message);
    res.status(500).json({
      success: false,
      msg: "An error occurred while fetching auth endpoints",
    });
  }
};
