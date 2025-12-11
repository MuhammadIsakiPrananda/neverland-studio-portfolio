// server.js - SIMPLIFIED VERSION
import dotenv from "dotenv";
dotenv.config(); // Load .env file

import express from "express"; // Must be after dotenv
import cors from "cors";
import passport from "passport";
import connectSessionSequelize from "connect-session-sequelize";
import session from "express-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import compression from "compression";

// Database & Models
import sequelize from "./config/database.js";
import User from "./models/User.js"; // Impor model User secara langsung

// Configurations
import config, { validateConfig } from "./config/config.js";
import configurePassport from "./config/passport.js";
import configureGithubStrategy from "./config/passportGithub.js";
import configureGoogleStrategy from "./config/passportGoogle.js";
import { validateUrls } from "./utils/urlConfig.js";
import logger, { requestLogger } from "./utils/logger.js";
import {
  runMigrations,
  ensureMigrationsTable,
} from "./utils/migrationRunner.js";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import configRoutes from "./routes/config.js";
import healthRoutes from "./routes/health.js";

import { errorHandler } from "./utils/errors.js";

// --- INITIALIZATION ---
const app = express();

// Trust proxy for reverse proxy/Argo tunnel (Cloudflare, nginx, etc.)
app.set("trust proxy", 1);

// Disable X-Powered-By header for security
app.disable("x-powered-by");

// --- PRODUCTION OPTIMIZATIONS ---

// Compression middleware - Gzip/Deflate responses
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Balance between speed and compression ratio
  })
);

// --- SECURITY MIDDLEWARE ---

// --- SECURITY MIDDLEWARE ---

// 1. Helmet - Enhanced Security Headers
const helmetConfig = {
  contentSecurityPolicy: config.isProduction
    ? {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: [
            "'self'",
            "data:",
            "https:",
            "lh3.googleusercontent.com",
            "avatars.githubusercontent.com",
          ],
          connectSrc: ["'self'", process.env.FRONTEND_URL],
          fontSrc: ["'self'", "https:", "data:"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: config.isProduction
    ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      }
    : false,
  noSniff: true,
  frameguard: { action: "deny" },
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
};

app.use(helmet(helmetConfig));

// 2. CORS Configuration - Production Ready
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : config.isProduction
  ? [
      "https://neverlandstudio.my.id",
      "https://www.neverlandstudio.my.id",
      "https://api.neverlandstudio.my.id",
    ]
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Allow same-origin requests
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["X-CSRF-Token", "Authorization"],
  optionsSuccessStatus: 200,
  maxAge: 86400,
  preflightContinue: false,
};
app.use(cors(corsOptions));

// 3. Request Logging - Must be early to catch all requests
app.use(requestLogger);

// 4. Body Parsing - Must be before routes
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 5. Data Sanitization
app.use(xss()); // Prevent XSS attacks

// 6. Rate Limiting - Production Security
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.isProduction ? 20 : 50, // Lebih longgar di production dan dev
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded`, {
      ip: req.ip,
      path: req.path,
      userAgent: req.get("user-agent"),
    });
    res.status(429).json({
      success: false,
      msg: "Too many attempts. Please try again later.",
      retryAfter: 900,
    });
  },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isProduction ? 100 : 200,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Apply rate limiting to specific authentication endpoints
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/refresh", authLimiter);
app.use("/api/auth/delete", authLimiter);
app.use("/api/user/change-password", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// --- SESSION CONFIGURATION (PRODUCTION-READY) ---
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "sessions",
  checkExpirationInterval: 15 * 60 * 1000, // Clean expired sessions every 15 min
  expiration: 24 * 60 * 60 * 1000, // 24 hours
});

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: "neverland.sid", // Custom session name
    rolling: true, // Reset expiration on every request
    cookie: {
      secure: config.isProduction, // HTTPS only in production
      httpOnly: true, // Prevent XSS
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,
      sameSite: config.isProduction ? "none" : "lax", // For OAuth cross-site
    },
    proxy: true, // Trust proxy for secure cookies behind reverse proxy
    store: sessionStore, // Use the persistent database store
  })
);

// --- PASSPORT INITIALIZATION ---
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
configurePassport(passport);
configureGithubStrategy(passport);
configureGoogleStrategy(passport); // Aktifkan strategi Google

// Passport serialization for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "username",
        "email",
        "image",
        "role",
        "provider",
      ],
    });
    done(null, user);
  } catch (error) {
    logger.error("Passport deserialize error:", error);
    done(error, null);
  }
});

// --- ROUTES ---

// Root endpoint for basic API status check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Neverland Studio API!",
    status: "running",
    version: "1.0.0",
    environment: config.nodeEnv,
  });
});

// === API ROUTES ===

// API Info Endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Neverland Studio API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      config: "/api/config",
      health: "/api/health",
    },
    documentation:
      "https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio",
  });
});

// Health Check Endpoint (must be registered early for monitoring)
app.use("/api/health", healthRoutes);

// Main API Routes
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);
app.use("/api/user", userRoutes);

// 404 Handler (must be last)
app.use("*", (req, res) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`, {
    ip: req.ip,
    method: req.method,
  });
  res.status(404).json({
    success: false,
    msg: `Route not found: ${req.originalUrl}`,
  });
});

// Error Handler
app.use(errorHandler);

// --- GRACEFUL SHUTDOWN ---
let server;

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);

  // Stop accepting new connections
  if (server) {
    server.close(() => {
      logger.info("HTTP server closed");
    });
  }

  try {
    // Close database connections
    await sequelize.close();
    logger.info("Database connection closed");

    // Give time for pending requests to complete
    setTimeout(() => {
      logger.info("Forcing shutdown");
      process.exit(0);
    }, 10000); // 10 seconds grace period
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Uncaught Exception Handler
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("UNHANDLED REJECTION! Shutting down...", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Validate configuration
    validateConfig();
    validateUrls();

    // Database Connection with retry logic
    let dbConnected = false;
    let retries = config.isDevelopment ? 2 : 5;

    while (retries > 0) {
      try {
        await sequelize.authenticate();
        logger.info("✅ Database connected successfully");
        dbConnected = true;
        break;
      } catch (error) {
        retries--;
        logger.warn(`Database connection failed. Retries left: ${retries}`, {
          error: error.message,
        });

        if (retries === 0) {
          if (config.isDevelopment) {
            logger.warn(
              "⚠️  WARNING: Starting without database connection (Development Mode)"
            );
            logger.warn(
              "📋 To fix: Install and start MySQL/MariaDB, or run 'docker-compose up -d mariadb_neverland'"
            );
            break;
          } else {
            throw error;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    // Database Sync Strategy (only if connected)
    if (dbConnected) {
      // Ensure migrations tracking table exists
      await ensureMigrationsTable(sequelize);

      // Run migrations automatically
      logger.info("🔄 Running database migrations...");
      const migrationSuccess = await runMigrations();

      if (!migrationSuccess && config.isProduction) {
        throw new Error("Migration failed in production mode");
      }

      // In development, also sync models for quick iteration
      if (config.isDevelopment) {
        logger.warn(
          "⚠️  Development Mode: Syncing database schema with { alter: true }"
        );
        await sequelize.sync({ alter: true });
      }

      // Create session table if it doesn't exist
      await sessionStore.sync();
      logger.info("✅ Session store initialized");
    } else {
      logger.warn("⚠️  Session store not initialized (no database)");
    }

    // Start server
    server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${config.nodeEnv}`);
      logger.info(`🔒 CORS enabled for: ${allowedOrigins.join(", ")}`);

      if (config.isProduction) {
        logger.info("🔐 Production mode: Enhanced security enabled");
      }
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use`);
      } else {
        logger.error("Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
