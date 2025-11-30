// utils/errors.js - Custom error handling

export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
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
      msg: 'Validation error',
      details,
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return res.status(400).json({
      success: false,
      msg: `This ${field} is already in use`,
      details: { field },
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || 'An internal server error occurred',
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
