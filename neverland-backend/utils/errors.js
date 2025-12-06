// utils/errors.js - Custom error handling
import logger from './logger.js'; // Menggunakan logger terpusat

export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export const errorHandler = (err, req, res, next) => {
  // Log error menggunakan Winston untuk logging yang lebih baik di produksi
  logger.error(err.message, { 
    stack: err.stack, 
    statusCode: err.statusCode, 
    path: req.path,
    method: req.method
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      msg: err.message,
      details: err.details,
    });
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const details = err.errors.map(e => ({
      field: e.path,
      msg: e.message,
    }));
    return res.status(400).json({
      success: false,
      msg: 'Validation failed. Please check your input.',
      details,
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    // PENTING: Pesan generik untuk mencegah user enumeration.
    // Jangan bocorkan field mana yang sudah ada (email atau username).
    return res.status(409).json({
      success: false,
      msg: 'An account with this email or username already exists.',
    });
  }

  // Default error response untuk semua error lainnya
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    // Di produksi, sembunyikan detail error internal (status 500)
    msg: isProduction && statusCode === 500 ? 'An internal server error occurred.' : err.message || 'An error occurred.',
  });
};

export class ValidationError extends ApiError {
  constructor(details) {
    super(400, 'Validation error', details);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(msg = 'Unauthorized') {
    super(401, msg);
  }
}

export class ConflictError extends ApiError {
  constructor(msg) {
    super(409, msg);
  }
}

export class InternalError extends ApiError {
  constructor(msg = 'Internal server error') {
    super(500, msg);
  }
}
