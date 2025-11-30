// utils/validation.js - Validasi dan sanitasi input

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimal 8 karakter, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username) => {
  // Username: 3-20 karakter, alphanumeric dan underscore
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

export const validateRegistrationInput = (data) => {
  const errors = {};

  if (!data.name || !validateName(data.name)) {
    errors.name = 'Name must be between 2 and 100 characters';
  }

  if (!data.username || !validateUsername(data.username)) {
    errors.username = 'Username must be 3-20 characters (alphanumeric and underscore only)';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginInput = (data) => {
  const errors = {};

  if (!data.identifier) {
    errors.identifier = 'Email or username is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
