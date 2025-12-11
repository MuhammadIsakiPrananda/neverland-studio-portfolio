// utils/validation.js - ENHANCED VALIDATION with better security

/**
 * Sanitize string input to prevent XSS and injection attacks
 * @param {string} str - Input string
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (str) => {
  if (!str) return "";

  return str
    .toString()
    .trim()
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers (onclick, onload, etc.)
    .substring(0, 1000); // Limit length to prevent DoS
};

/**
 * Validate email format with strict regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  // RFC 5322 compliant email regex (simplified but secure)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254; // Max email length per RFC
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
export const isValidUsername = (username) => {
  // Alphanumeric, underscore, hyphen only. 3-30 characters.
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password strength - USER FRIENDLY VERSION
 * Requirements:
 * - At least 8 characters
 * - Contains letters and numbers (no special character required)
 * @param {string} password - Password to validate
 * @returns {object} - { isValid, errors }
 */
export const validatePasswordStrength = (password, context = {}) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (password && password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  // Hanya butuh huruf DAN angka (tidak wajib uppercase/special char)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter) {
    errors.push("Password must contain at least one letter");
  }

  if (!hasNumber) {
    errors.push("Password must contain at least one number");
  }

  // Check for common weak passwords
  const commonPasswords = [
    "password",
    "12345678",
    "qwerty123",
    "admin123",
    "letmein",
  ];
  if (commonPasswords.some((weak) => password?.toLowerCase() === weak)) {
    errors.push("Password is too common, please choose a stronger one");
  }

  // Disallow username in password (untuk keamanan)
  if (
    context.username &&
    password?.toLowerCase().includes(context.username.toLowerCase())
  ) {
    errors.push("Password must not contain your username");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate registration input with comprehensive checks
 * @param {object} data - { name, username, email, password }
 * @returns {object} - { isValid, errors }
 */
export const validateRegistrationInput = ({
  name,
  username,
  email,
  password,
}) => {
  const errors = {};

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (name && name.length > 100) {
    errors.name = "Name must not exceed 100 characters";
  }
  // Allow a wider range of characters for international names
  if (name && !/^[a-zA-Z\s'-.\p{L}]+$/u.test(name)) {
    errors.name =
      "Name can only contain letters, spaces, hyphens, and apostrophes";
  }

  // Username validation
  if (!username || username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (!isValidUsername(username)) {
    errors.username =
      "Username can only contain letters, numbers, underscores, and hyphens (3-30 characters)";
  }

  // Email validation
  if (!email || !isValidEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  // Password validation
  const passwordValidation = validatePasswordStrength(password, {
    username,
    email,
  });
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors; // Return array for better frontend feedback
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login input
 * @param {object} data - { identifier, password }
 * @returns {object} - { isValid, errors }
 */
export const validateLoginInput = ({ identifier, password }) => {
  const errors = {};

  if (!identifier || identifier.trim().length === 0) {
    errors.identifier = "Email or username is required";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate profile update input
 * @param {object} data - { name, bio, image }
 * @returns {object} - { isValid, errors }
 */
export const validateProfileUpdate = ({ name, bio, image }) => {
  const errors = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (name.length > 100) {
      errors.name = "Name must not exceed 100 characters";
    }
  }

  if (bio !== undefined) {
    if (typeof bio !== "string") {
      errors.bio = "Bio must be a string";
    }
    if (bio.length > 500) {
      errors.bio = "Bio must not exceed 500 characters";
    }
  }

  if (image !== undefined) {
    if (typeof image !== "string") {
      errors.image = "Image must be a valid URL string";
    }
    if (image.length > 1000) {
      errors.image = "Image URL too long";
    }
    // Basic URL validation
    try {
      if (image) new URL(image);
    } catch {
      errors.image = "Image must be a valid URL";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate password change input
 * @param {object} data - { currentPassword, newPassword }
 * @returns {object} - { isValid, errors }
 */
export const validatePasswordChange = ({ currentPassword, newPassword }) => {
  const errors = {};

  if (!currentPassword || currentPassword.length === 0) {
    errors.currentPassword = "Current password is required";
  }

  const newPasswordValidation = validatePasswordStrength(newPassword, {
    username: req.user?.username,
  });
  if (!newPasswordValidation.isValid) {
    errors.newPassword = newPasswordValidation.errors; // Return array
  }

  if (currentPassword === newPassword) {
    errors.newPassword = "New password must be different from current password";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Rate limit check helper
 * @param {string} identifier - User identifier (IP, email, etc.)
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if rate limit exceeded
 */
const rateLimitStore = new Map();

export const checkRateLimit = (
  identifier,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
) => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count++;
  rateLimitStore.set(identifier, record);

  return record.count > maxAttempts;
};

/**
 * Clean up expired rate limit records
 */
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

export default {
  sanitizeString,
  isValidEmail,
  isValidUsername,
  validatePasswordStrength,
  validateRegistrationInput,
  validateLoginInput,
  validateProfileUpdate,
  validatePasswordChange,
  checkRateLimit,
  cleanupRateLimitStore,
};
