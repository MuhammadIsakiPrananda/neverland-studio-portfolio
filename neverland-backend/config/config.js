// neverland-backend/config/config.js - Centralized Configuration Management
import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized configuration object
 * Validates and exports all environment variables with proper defaults
 */
const config = {
  // --- Environment ---
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",

  // --- Server ---
  port: parseInt(process.env.PORT || "5000", 10),

  // --- URLs ---
  backendUrl:
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://api.neverlandstudio.my.id"
      : `http://localhost:${process.env.PORT || 5000}`),
  frontendUrl:
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://neverlandstudio.my.id"
      : "http://localhost:5173"),
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : process.env.NODE_ENV === "production"
    ? [
        "https://neverlandstudio.my.id",
        "https://www.neverlandstudio.my.id",
        "https://api.neverlandstudio.my.id",
      ]
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
      ],

  // --- Database ---
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    name: process.env.DB_NAME || "neverlandstudio",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    dialect: "mariadb", // Always use mariadb for better compatibility
  },

  // --- Security ---
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  sessionSecret:
    process.env.SESSION_SECRET || "dev-session-secret-change-in-production",

  // --- OAuth ---
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  },

  // --- reCAPTCHA ---
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY || "",
    secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  },

  // --- Email (Optional) ---
  email: {
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
    smtpUser: process.env.SMTP_USER || "",
    smtpPassword: process.env.SMTP_PASSWORD || "",
    emailFrom: process.env.EMAIL_FROM || "",
  },

  // --- Logging ---
  logLevel: process.env.LOG_LEVEL || "info",
  logFile: process.env.LOG_FILE || "logs/app.log",
};

/**
 * Validate required configuration - Flexible for both dev and production
 */
export const validateConfig = () => {
  const warnings = [];
  const errors = [];

  // Auto-detect if running in actual development (localhost)
  const isLocalDev =
    config.database.host === "localhost" ||
    config.backendUrl.includes("localhost") ||
    config.database.host === "127.0.0.1";

  if (config.isProduction && !isLocalDev) {
    // Critical production checks only for real production
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      errors.push(
        "JWT_SECRET must be set and at least 32 characters in production"
      );
    }

    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
      errors.push(
        "SESSION_SECRET must be set and at least 32 characters in production"
      );
    }

    if (!process.env.DB_PASSWORD) {
      errors.push("DB_PASSWORD must be set in production");
    }
  } else if (isLocalDev) {
    // Running locally - just warnings
    if (!process.env.DB_PASSWORD) {
      warnings.push("DB_PASSWORD is empty (OK for local development)");
    }
  }

  // Show warnings
  if (warnings.length > 0) {
    console.warn("⚠️  Configuration Notes:");
    warnings.forEach((warn) => console.warn(`  - ${warn}`));
  }

  // Show errors
  if (errors.length > 0) {
    console.error("❌ Configuration Validation Errors:");
    errors.forEach((err) => console.error(`  - ${err}`));
    throw new Error("Invalid configuration. Please fix the errors above.");
  }

  return true;
};

export default config;
