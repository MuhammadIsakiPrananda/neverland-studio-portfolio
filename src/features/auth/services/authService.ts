// Authentication Service
// Handles all authentication related API calls

import { apiService } from "../../../services/apiService";

export interface LoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  recaptchaToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Store token if login successful
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      "/auth/register",
      data
    );

    // Store token if registration successful
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiService.post("/auth/logout");
    } finally {
      // Always clear local storage
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiService.get("/auth/me");
    return response.data;
  },

  // Refresh authentication token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>("/auth/refresh");

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiService.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiService.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiService.post("/auth/verify-email", { token });
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
};

export default authService;
