// utils/logger.js - Production-grade logging with Winston
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  // Format JSON sangat ideal untuk produksi karena dapat diurai oleh sistem agregasi log (misalnya, Datadog, Logstash, Splunk).
  winston.format.json() 
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Tentukan path direktori logs di root proyek
const logsDir = path.join(process.cwd(), 'logs');

// Pastikan direktori logs ada sebelum Winston mencoba menulis ke dalamnya.
// Ini mencegah error saat startup di lingkungan baru.
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'neverland-backend' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// If not in production, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Create request logging middleware
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

// Security event logger
export const logSecurityEvent = (event, details) => {
  logger.warn('SECURITY EVENT', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

// Auth event logger
export const logAuthEvent = (event, userId, details = {}) => {
  logger.info('AUTH EVENT', {
    event,
    userId,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

// Database event logger
export const logDatabaseEvent = (event, details = {}) => {
  logger.info('DATABASE EVENT', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

export default logger;