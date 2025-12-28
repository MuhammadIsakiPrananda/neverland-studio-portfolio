/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for API base URL configuration.
 * It automatically switches between local development and production environments
 * based on the VITE_API_URL environment variable.
 */

// Get API URL from environment variable
const VITE_API_URL = import.meta.env.VITE_API_URL;

// Default fallback for local development
const DEFAULT_LOCAL_API_URL = 'http://127.0.0.1:8000/api';

/**
 * Get the API base URL
 * 
 * @returns {string} The API base URL based on the current environment
 */
export const getApiUrl = (): string => {
  const apiUrl = VITE_API_URL || DEFAULT_LOCAL_API_URL;
  
  // Log warning if using fallback (for development debugging)
  if (!VITE_API_URL && import.meta.env.DEV) {
    console.warn(
      `[API Config] Using fallback API URL: ${DEFAULT_LOCAL_API_URL}\n` +
      'Set VITE_API_URL in your .env file for custom configuration.'
    );
  }
  
  return apiUrl;
};

/**
 * Get the environment mode
 * 
 * @returns {string} Current environment (development, production, etc.)
 */
export const getEnvironment = (): string => {
  return import.meta.env.MODE || 'development';
};

/**
 * Check if running in development mode
 * 
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if running in production mode
 * 
 * @returns {boolean} True if in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

// Export API URL as constant for convenience
export const API_BASE_URL = getApiUrl();

// Log current configuration in development
if (isDevelopment()) {
  console.log('[API Config] Initialized with:', {
    environment: getEnvironment(),
    apiUrl: API_BASE_URL,
  });
}
