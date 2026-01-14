/**
 * Authentication API Service
 * 
 * Consolidated authentication service combining login, registration,
 * OAuth, and session management.
 */

import { get, post, handleApiError } from '../core/apiClient';
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    User,
} from '../../types';
import { showError, showSuccess, showWarning } from '../../components/common/ModernNotification';

/**
 * User profile structure for localStorage
 */
interface UserProfile {
    username: string;
    name: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    company?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    birthDate?: string;
    gender?: string;
    role: string;
}

/**
 * Helper to create user profile from API user data
 */
const createUserProfile = (user: any): UserProfile => ({
    username: user.username || user.email.split('@')[0],
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    jobTitle: user.job_title || '',
    company: user.company || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    avatar: user.avatar,
    github: user.github || '',
    twitter: user.twitter || '',
    linkedin: user.linkedin || '',
    instagram: user.instagram || '',
    birthDate: user.birth_date || '',
    gender: user.gender || '',
    role: user.role || 'user',
});

/**
 * Helper to store authentication data
 */
const storeAuthData = (token: string, user: any): void => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_mode', 'backend');
    localStorage.setItem('userProfile', JSON.stringify(createUserProfile(user)));
};

/**
 * Helper to clear authentication data
 */
const clearAuthData = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_mode');
    localStorage.removeItem('userProfile');
};

/**
 * Authentication Service
 */
export const authApi = {
    /**
     * Register new user
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await post<{ user: User; token: string; expires_in?: number }>(
                '/auth/register',
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }
            );

            if (response.success && response.data) {
                const { token, user } = response.data;
                storeAuthData(token, user);

                showSuccess(
                    'Account Created! 🎉',
                    `Welcome ${user.name}! You can now access your account.`
                );
            }

            return {
                user: response.data!.user,
                token: response.data!.token,
                expires_in: response.data!.expires_in,
            };
        } catch (error: any) {
            const apiError = handleApiError(error);
            showError('Registration Failed', apiError.message);
            throw apiError;
        }
    },

    /**
     * Login user
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await post<{ user: User; token: string; expires_in?: number }>(
                '/auth/login',
                {
                    email: data.email,
                    password: data.password,
                    remember: data.remember,
                }
            );

            if (response.success && response.data) {
                const { token, user } = response.data;
                storeAuthData(token, user);

                showSuccess('Welcome Back! 👋', `Successfully logged in as ${user.name}`);
            }

            return {
                user: response.data!.user,
                token: response.data!.token,
                expires_in: response.data!.expires_in,
            };
        } catch (error: any) {
            const apiError = handleApiError(error);
            showError('Login Failed', apiError.message);
            throw apiError;
        }
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthData();
            showSuccess('Logged Out Successfully! 👋', 'See you again soon.');
        }
    },

    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await get<{ user: User }>('/auth/user', {
                timeout: 5000,
            });
            return response.data?.user || null;
        } catch (error: any) {
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
     * Get stored user data from localStorage
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
     * Forgot password - Send reset link
     */
    async forgotPassword(email: string): Promise<void> {
        try {
            await post('/auth/forgot-password', { email });
            showSuccess('Email Sent!', 'Password reset link has been sent to your email.');
        } catch (error: any) {
            const apiError = handleApiError(error);
            showError('Request Failed', apiError.message);
            throw apiError;
        }
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordRequest): Promise<void> {
        try {
            await post('/auth/reset-password', {
                token: data.token,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });
            showSuccess('Password Reset!', 'Your password has been reset successfully.');
        } catch (error: any) {
            const apiError = handleApiError(error);
            showError('Reset Failed', apiError.message);
            throw apiError;
        }
    },

    /**
     * Social login - Get OAuth redirect URL
     */
    async getSocialLoginUrl(provider: 'google' | 'github'): Promise<string> {
        try {
            const response = await get<{ redirect_url: string }>(`/auth/${provider}/redirect`);

            if (response.success && response.data?.redirect_url) {
                return response.data.redirect_url;
            }

            throw new Error('Failed to get redirect URL');
        } catch (error: any) {
            const apiError = handleApiError(error);
            throw new Error(apiError.message || `Failed to initialize ${provider} login`);
        }
    },

    /**
     * Handle OAuth callback
     */
    async handleOAuthCallback(provider: 'google' | 'github', code: string): Promise<AuthResponse> {
        try {
            const response = await get<{ user: User; token: string; expires_in?: number }>(
                `/auth/${provider}/callback?code=${code}`
            );

            if (response.success && response.data) {
                const { token, user } = response.data;
                storeAuthData(token, user);

                showSuccess('Login Successful! 🎉', `Welcome back ${user.name}!`);
            }

            return {
                user: response.data!.user,
                token: response.data!.token,
                expires_in: response.data!.expires_in,
            };
        } catch (error: any) {
            const apiError = handleApiError(error);
            showError('Authentication Failed', apiError.message);
            throw apiError;
        }
    },
};

// Export as default for backward compatibility
export default authApi;
