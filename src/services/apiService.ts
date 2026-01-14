import axios from 'axios';
import { getApiUrl } from '../config/api.config';

// Use centralized API configuration
const API_URL = getApiUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout (balanced)
  withCredentials: true, // Enable CORS credentials
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 if we're in backend mode (not mock mode)
    const authMode = localStorage.getItem('auth_mode');
    
    if (error.response?.status === 401 && authMode === 'backend') {
      // Unauthorized - clear token and notify user
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_mode');
      
      // Use modern notification instead of alert
      import('../components/common/ModernNotification').then(({ showWarning }) => {
        showWarning(
          'Session Expired ⏱️',
          'Your session has expired. Please login again.'
        );
      });
      
      // Redirect to home after short delay
      setTimeout(() => {
        window.location.href = '/home';
      }, 2000);
    }
    
    // For mock mode or network errors, just reject without logging out
    return Promise.reject(error);
  }
);

// Security API Service
export const securityService = {
  // Change Password
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    const response = await api.post('/security/change-password', data);
    return response.data;
  },

  // Enable 2FA - Get QR Code
  async enable2FA() {
    const response = await api.post('/security/2fa/enable');
    return response.data;
  },

  // Verify 2FA Code
  async verify2FA(code: string) {
    const response = await api.post('/security/2fa/verify', { code });
    return response.data;
  },

  // Disable 2FA
  async disable2FA(password: string) {
    const response = await api.post('/security/2fa/disable', { password });
    return response.data;
  },

  // Get Login History
  async getLoginHistory(limit: number = 20) {
    const response = await api.get(`/security/login-history?limit=${limit}`);
    return response.data;
  },

  // Get Active Sessions
  async getActiveSessions() {
    const response = await api.get('/security/sessions');
    return response.data;
  },

  // Revoke Session
  async revokeSession(sessionId: number) {
    const response = await api.delete(`/security/sessions/${sessionId}`);
    return response.data;
  },
};

// Profile API Service
export const profileService = {
  // Get Profile
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update Profile (includes avatar as base64)
  async updateProfile(data: any) {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Upload Avatar (dedicated endpoint for avatar only)
  async uploadAvatar(avatar: string) {
    const response = await api.post('/profile/avatar', { avatar });
    return response.data;
  },
  
  // Delete Avatar (reset to default)
  async deleteAvatar() {
    const response = await api.delete('/profile/avatar');
    return response.data;
  }
};

// User Management API Service
export const userService = {
  // Get all users with pagination and filters
  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
  }) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Create new user
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    bio?: string;
    location?: string;
  }) {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  // Get single user
  async getUser(id: number) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  async updateUser(id: number, data: any) {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async deleteUser(id: number) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Restore deleted user
  async restoreUser(id: number) {
    const response = await api.post(`/admin/users/${id}/restore`);
    return response.data;
  },

  // Get user stats
  async getUserStats() {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },
};

export default api;
