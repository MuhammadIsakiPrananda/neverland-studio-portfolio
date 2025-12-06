/**
 * Application Constants
 * Central location for all constant values
 */

// ============================================
// API CONSTANTS
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    GOOGLE: "/auth/google",
    GITHUB: "/auth/github",
  },
  // User
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
    DELETE: "/user/delete",
  },
  // Config
  CONFIG: {
    GET: "/config",
    UPDATE: "/config",
  },
} as const;

// ============================================
// ROUTE CONSTANTS
// ============================================

export const ROUTES = {
  HOME: "/",
  AUTH_SUCCESS: "/auth-success",
  ACCESS_DENIED: "/access-denied",

  // Dashboard
  DASHBOARD: {
    ROOT: "/dashboard",
    OVERVIEW: "/dashboard",
    ANALYTICS: "/dashboard/analytics",
    PROJECTS: "/dashboard/projects",
    TEAM: "/dashboard/team",
    SETTINGS: "/dashboard/settings",
    CALENDAR: "/dashboard/calendar",
    INBOX: {
      REVIEWS: "/dashboard/inbox/reviews",
      APPLICANTS: "/dashboard/inbox/applicants",
      COLLABORATIONS: "/dashboard/inbox/collaborations",
    },
  },
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// ============================================
// UI CONSTANTS
// ============================================

export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// ============================================
// VALIDATION CONSTANTS
// ============================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  BIO_MAX_LENGTH: 500,
} as const;
