import axios from 'axios';
import { showError, showSuccess } from '../components/common/ModernNotification';
import { getApiUrl } from '../config/api.config';

// Use centralized API configuration
const API_BASE_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired - clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_mode');
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  avatar?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: Record<string, string[]>;
}

export const authService = {
  /**
   * Register new user
   */
  async register(name: string, username: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.success && response.data.data) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('auth_mode', 'backend');
        
        showSuccess(
          'Account Created! 🎉',
          `Welcome ${response.data.data.user.name}! You can now access your account.`
        );
      }

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      const errors = error.response?.data?.errors;
      
      showError('Registration Failed', errorMessage);

      return {
        success: false,
        message: errorMessage,
        errors: errors
      };
    }
  },

  /**
   * Login user (supports both email and username)
   */
  async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login for:', emailOrUsername);

      const response = await api.post<AuthResponse>('/auth/login', {
        email: emailOrUsername, // Backend accepts email or username in 'email' field
        password,
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.data) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('auth_mode', 'backend');
        
        showSuccess(
          'Welcome Back! 👋',
          `Successfully logged in as ${response.data.data.user.name}`
        );
      } else {
        showError('Login Failed', response.data.message);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      const errors = error.response?.data?.errors;
      
      showError('Login Failed', errorMessage);

      return {
        success: false,
        message: errorMessage,
        errors: errors
      };
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_mode');
      
      showSuccess(
        'Logged Out Successfully! 👋',
        'See you again soon.'
      );
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/user', {
        timeout: 5000 // Shorter timeout for user check
      });
      return response.data.data.user;
    } catch (error: any) {
      // Only log non-timeout errors
      if (error.code !== 'ECONNABORTED') {
        console.error('Get user error:', error);
      }
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/forgot-password', { email });
      
      if (response.data.success) {
        showSuccess('Email Sent!', 'Password reset link has been sent to your email.');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link.';
      showError('Request Failed', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      if (response.data.success) {
        showSuccess('Password Reset!', 'Your password has been reset successfully.');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password.';
      showError('Reset Failed', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  /**
   * Social login - Get OAuth redirect URL
   */
  async socialLogin(provider: 'google' | 'github'): Promise<string> {
    try {
      const response = await api.get(`/auth/${provider}/redirect`);
      
      if (response.data.success && response.data.redirect_url) {
        return response.data.redirect_url;
      }
      
      throw new Error('Failed to get redirect URL');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to initialize ${provider} login`;
      throw new Error(errorMessage);
    }
  },

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(provider: 'google' | 'github', code: string): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>(`/auth/${provider}/callback`, {
        params: { code }
      });

      if (response.data.success && response.data.data) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('auth_mode', 'backend');
        
        showSuccess(
          'Login Successful! 🎉',
          `Welcome back ${response.data.data.user.name}!`
        );
      }

      return response.data;
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      
      const errorMessage = error.response?.data?.message || `${provider} authentication failed`;
      showError('Authentication Failed', errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }
  }
};
