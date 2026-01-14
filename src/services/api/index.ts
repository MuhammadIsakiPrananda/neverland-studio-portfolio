/**
 * Public Services Index
 * 
 * Centralized exports for all API services.
 * Import from this file instead of individual service files.
 * 
 * Example:
 * import { authApi, dashboardApi, profileApi } from '@/services/api';
 */

// Core API client
export { default as apiClient, get, post, put, patch, del, handleApiError } from '../core/apiClient';

// API Services
export { authApi, default as authService } from './auth';
export { dashboardApi, default as dashboardService } from './dashboard';
export { profileApi, default as profileService } from './profile';
export { realtimeApi, RealtimePoller, default as realtimeService } from './realtime';

// Re-export all types for convenience
export type * from '../../types';
