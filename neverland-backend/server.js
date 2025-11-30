// Muat variabel lingkungan dari file .env sesegera mungkin. Ini harus menjadi baris pertama.
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import sequelize from './config/database.js';

// Import model agar Sequelize tahu tabel apa yang harus dibuat
import './models/User.js';

// Jalankan konfigurasi Passport
import './config/passport.js';

// Import routes
import authRoutes from './config/authRoutes.js';
import googleAuthRoutes from './config/googleAuthRoutes.js';
import userRoutes from './config/userRoutes.js';
import configRoutes from './config/configRoutes.js';

// Import error handler
import { errorHandler } from './utils/errors.js';

const app = express();

// ============= MIDDLEWARE =============

// 1. CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 2. Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// 3. Request Parser
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Passport Initialization
app.use(passport.initialize());

// ============= ROUTES =============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);

// Configuration Routes (public)
app.use('/api/config', configRoutes);

// User Routes (protected)
app.use('/api/user', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: 'Route not found',
    path: req.path,
  });
});

// ============= ERROR HANDLER =============
app.use(errorHandler);

// ============= START SERVER =============
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test Database Connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');

    // Synchronize Models
    // Force: true akan drop dan recreate table (hanya development)
    const forceSync = process.env.NODE_ENV !== 'production';
    await sequelize.sync({ alter: !forceSync, force: forceSync });
    console.log('✓ All models synchronized');

    // Start Server
    app.listen(PORT, () => {
      const mode = process.env.NODE_ENV || 'development';
      const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      console.log('\n========================================');
      console.log(`🚀 Server is running`);
      console.log(`📱 Mode: ${mode}`);
      console.log(`🔗 Port: ${PORT}`);
      console.log(`🌐 Frontend: ${frontend}`);
      console.log('========================================\n');
    });
  } catch (err) {
    console.error('✗ Unable to start the server:', err.message);
    process.exit(1);
  }
};

startServer();

