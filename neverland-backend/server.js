// server.js - SIMPLIFIED VERSION
import dotenv from 'dotenv';
dotenv.config(); // Load .env file

import express from 'express'; // Must be after dotenv
import cors from 'cors';
import passport from 'passport';
import connectSessionSequelize from 'connect-session-sequelize';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

// Database & Models
import sequelize from './config/database.js';
import User from './models/User.js'; // Impor model User secara langsung

// Configurations
import config, { validateConfig } from './config/config.js';
import configurePassport from './config/passport.js';
import configureGithubStrategy from './config/passportGithub.js';
import configureGoogleStrategy from './config/passportGoogle.js';
import { validateUrls } from './utils/urlConfig.js';
import logger, { requestLogger } from './utils/logger.js';

// Routes
import authRoutes from './config/authRoutes.js';
import userRoutes from './config/userRoutes.js';
import configRoutes from './config/configRoutes.js';
import healthRoutes from './routes/health.js';

import { errorHandler } from './utils/errors.js';

// --- INITIALIZATION ---
const app = express();

// Trust proxy for reverse proxy/Argo tunnel (Cloudflare, nginx, etc.)
app.set('trust proxy', 1);

// --- SECURITY MIDDLEWARE ---

// 1. Helmet - Enhanced Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For inline styles if needed
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "lh3.googleusercontent.com", "avatars.githubusercontent.com"], // Allow OAuth images
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      fontSrc: ["'self'", "https:", "data:"],
    },
  },
  crossOriginEmbedderPolicy: false, // For OAuth redirects
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
}));

// 2. CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate Limiting - Different limits for different endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes for auth endpoints
  message: 'Too many authentication attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      msg: 'Too many attempts. Please try again later.',
      retryAfter: 900 // seconds
    });
  }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/user/change-password', authLimiter);
app.use('/api', generalLimiter);

// 4. Data Sanitization
app.use(xss()); // Prevent XSS attacks

// 5. Request Logging - Use the custom Winston-based logger for structured logs
// This replaces morgan and provides more detailed, consistent logging across all environments.
app.use(requestLogger);

// --- STANDARD MIDDLEWARE ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- SESSION CONFIGURATION (PRODUCTION-READY) ---
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions', // The name of the session table
});

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Don't use default 'connect.sid'
  cookie: {
    secure: config.isProduction, // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // Use 'none' for production to support cross-site requests through Cloudflare Tunnel
    // This is required for OAuth flows and API calls from frontend subdomain
    sameSite: config.isProduction ? 'none' : 'lax',
    // Don't set domain in production - let browser handle it automatically
    // This ensures cookies work correctly with Cloudflare Tunnel
  },
  proxy: true, // Trust proxy for secure cookies behind reverse proxy
  store: sessionStore, // Use the persistent database store
}));

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
    const user = await User.findByPk(id); // Gunakan model yang sudah diimpor
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// --- ROUTES ---

// Root endpoint for basic API status check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Neverland Studio API!',
    status: 'API is running correctly.',
    // Anda bisa menambahkan link ke dokumentasi API di sini jika ada
    // docs: `${req.protocol}://${req.get('host')}/api-docs` 
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date(),
      environment: config.nodeEnv,
      database: 'connected',
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date()
    });
  }
});

// Pasang router utama. authRoutes sudah mengelola semua sub-router (Google, GitHub, dll.).
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/user', userRoutes);

// 404 Handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    msg: `Route not found: ${req.originalUrl}`
  });
});

// Health Check Endpoint (for load balancers, monitoring)
app.use('/api/health', healthRoutes);

// Error Handler
app.use(errorHandler);

// --- GRACEFUL SHUTDOWN ---
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  try {
    await sequelize.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', error);
  process.exit(1);
});

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Validate configuration
    validateConfig();
    validateUrls();

    // Database Connection
    await sequelize.authenticate();
    logger.info('✅ Database connected');

    // Database Sync Strategy
    if (process.env.NODE_ENV !== 'production') {
      logger.warn('⚠️  Dev Mode: Syncing database schema with { alter: true }');
      // In development, use { alter: true } to create/update tables automatically
      // NEVER use { force: true } in production as it will drop all tables!
      await sequelize.sync({ alter: true });
      logger.info('✅ Database schema synced successfully');
      // Sync the session table
      await sessionStore.sync();
      logger.info('✅ Session table synced');
    } else {
      logger.info('Production mode - Auto sync disabled. Use migrations.');
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`📡 Backend URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}`);
      logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      logger.info(`🔒 Security: Enhanced with Helmet, CORS, Rate Limiting, XSS Protection`);
    });
  } catch (err) {
    logger.error('❌ Server Startup Error:', err);
    process.exit(1);
  }
};

startServer();