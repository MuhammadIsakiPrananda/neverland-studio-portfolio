// neverland-backend/config/config.js - Centralized Configuration Management
import dotenv from 'dotenv';
dotenv.config();

/**
 * Centralized configuration object
 * Validates and exports all environment variables with proper defaults
 */
const config = {
    // --- Environment ---
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',

    // --- Server ---
    port: parseInt(process.env.PORT || '5000', 10),

    // --- URLs ---
    backendUrl: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],

    // --- Database ---
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        name: process.env.DB_NAME || 'neverland_db',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        dialect: process.env.DB_DIALECT || 'mysql',
    },

    // --- Security ---
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-change-in-production',

    // --- OAuth ---
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },

    // --- reCAPTCHA ---
    recaptcha: {
        siteKey: process.env.RECAPTCHA_SITE_KEY || '',
        secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
    },

    // --- Email (Optional) ---
    email: {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: process.env.SMTP_PASSWORD || '',
        emailFrom: process.env.EMAIL_FROM || '',
    },

    // --- Logging ---
    logLevel: process.env.LOG_LEVEL || 'info',
    logFile: process.env.LOG_FILE || 'logs/app.log',
};

/**
 * Validate required configuration in production
 */
export const validateConfig = () => {
    const errors = [];

    if (config.isProduction) {
        // Critical production checks
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            errors.push('JWT_SECRET must be set and at least 32 characters in production');
        }

        if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
            errors.push('SESSION_SECRET must be set and at least 32 characters in production');
        }

        if (!process.env.DB_PASSWORD) {
            errors.push('DB_PASSWORD must be set in production');
        }

        if (config.backendUrl.includes('localhost')) {
            errors.push('BACKEND_URL should not use localhost in production');
        }

        if (config.frontendUrl.includes('localhost')) {
            errors.push('FRONTEND_URL should not use localhost in production');
        }
    }

    if (errors.length > 0) {
        console.error('❌ Configuration Validation Errors:');
        errors.forEach(err => console.error(`  - ${err}`));

        if (config.isProduction) {
            throw new Error('Invalid production configuration. Please fix the errors above.');
        } else {
            console.warn('⚠️  Configuration warnings (development mode):');
            console.warn('  These would be fatal errors in production.');
        }
    }

    return true;
};

export default config;
