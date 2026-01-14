/**
 * Profile API Service
 * 
 * Handles user profile management and security operations.
 */

import { get, post, put, del, handleApiError } from '../core/apiClient';
import type { ProfileResponse, ProfileUpdateRequest, LoginHistory, UserSession } from '../../types';

/**
 * Profile Service
 */
export const profileApi = {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<ProfileResponse> {
        try {
            const response = await get<ProfileResponse>('/profile');
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
        try {
            const response = await put<ProfileResponse>('/profile', data);
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Upload avatar
     */
    async uploadAvatar(avatar: string): Promise<{ avatar: string }> {
        try {
            const response = await post<{ avatar: string }>('/profile/avatar', { avatar });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Delete avatar
     */
    async deleteAvatar(): Promise<void> {
        try {
            await del('/profile/avatar');
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Change password
     */
    async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<void> {
        try {
            await post('/security/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
            });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Enable 2FA
     */
    async enable2FA(): Promise<{ qr_code: string; secret: string }> {
        try {
            const response = await post<{ qr_code: string; secret: string }>('/security/2fa/enable');
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Verify 2FA code
     */
    async verify2FA(code: string): Promise<void> {
        try {
            await post('/security/2fa/verify', { code });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Disable 2FA
     */
    async disable2FA(password: string): Promise<void> {
        try {
            await post('/security/2fa/disable', { password });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get login history
     */
    async getLoginHistory(limit: number = 20): Promise<LoginHistory[]> {
        try {
            const response = await get<LoginHistory[]>(`/security/login-history?limit=${limit}`);
            return response.data || [];
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get active sessions
     */
    async getActiveSessions(): Promise<UserSession[]> {
        try {
            const response = await get<UserSession[]>('/security/sessions');
            return response.data || [];
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Revoke session
     */
    async revokeSession(sessionId: string): Promise<void> {
        try {
            await del(`/security/sessions/${sessionId}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default profileApi;
