/**
 * Dashboard API Service
 * 
 * Handles all dashboard-related API calls including statistics,
 * analytics, and administrative operations.
 */

import { get, post, put, del, handleApiError } from '../core/apiClient';
import type {
    DashboardStats,
    ActivityData,
    ChartData,
    PaginatedResponse,
    QueryParams,
} from '../../types';

/**
 * Dashboard Service
 */
export const dashboardApi = {
    /**
     * Get dashboard statistics
     */
    async getStats(): Promise<DashboardStats> {
        try {
            const response = await get<DashboardStats>('/dashboard/stats');
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get recent activities
     */
    async getRecentActivities(limit: number = 10): Promise<ActivityData[]> {
        try {
            const response = await get<ActivityData[]>(`/dashboard/activities?limit=${limit}`);
            return response.data || [];
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get chart data for analytics
     */
    async getChartData(type: 'users' | 'revenue' | 'enrollments', period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData> {
        try {
            const response = await get<ChartData>(`/dashboard/charts/${type}?period=${period}`);
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all contacts with pagination
     */
    async getContacts(params?: QueryParams): Promise<PaginatedResponse<any>> {
        try {
            const response = await get<PaginatedResponse<any>>('/dashboard/contacts', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Reply to contact message
     */
    async replyToContact(id: number, reply: string): Promise<void> {
        try {
            await post(`/dashboard/contacts/${id}/reply`, { reply });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Archive contact
     */
    async archiveContact(id: number): Promise<void> {
        try {
            await post(`/dashboard/contacts/${id}/archive`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all enrollments with pagination
     */
    async getEnrollments(params?: QueryParams): Promise<PaginatedResponse<any>> {
        try {
            const response = await get<PaginatedResponse<any>>('/dashboard/enrollments', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update enrollment status
     */
    async updateEnrollmentStatus(id: number, status: 'approved' | 'rejected', reason?: string): Promise<void> {
        try {
            await put(`/dashboard/enrollments/${id}`, { status, rejection_reason: reason });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all consultations with pagination
     */
    async getConsultations(params?: QueryParams): Promise<PaginatedResponse<any>> {
        try {
            const response = await get<PaginatedResponse<any>>('/dashboard/consultations', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update consultation status
     */
    async updateConsultationStatus(id: number, status: 'scheduled' | 'completed' | 'cancelled'): Promise<void> {
        try {
            await put(`/dashboard/consultations/${id}`, { status });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all newsletter subscribers
     */
    async getNewsletterSubscribers(params?: QueryParams): Promise<PaginatedResponse<any>> {
        try {
            const response = await get<PaginatedResponse<any>>('/dashboard/newsletter', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Export newsletter subscribers
     */
    async exportSubscribers(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
        try {
            const response = await get(`/dashboard/newsletter/export?format=${format}`, {
                responseType: 'blob',
            });
            return response.data as any;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all projects
     */
    async getProjects(params?: QueryParams): Promise<PaginatedResponse<any>> {
        try {
            const response = await get<PaginatedResponse<any>>('/admin/projects', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Create new project
     */
    async createProject(data: any): Promise<any> {
        try {
            const response = await post('/admin/projects', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update project
     */
    async updateProject(id: number, data: any): Promise<any> {
        try {
            const response = await put(`/admin/projects/${id}`, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Delete project
     */
    async deleteProject(id: number): Promise<void> {
        try {
            await del(`/admin/projects/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get all users (admin only)
     */
    async getUsers(params?: QueryParams): Promise<PaginatedResponse<any>> {
        try {
            const response = await get<PaginatedResponse<any>>('/admin/users', { params });
            return response.data!;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Create new user (admin only)
     */
    async createUser(data: any): Promise<any> {
        try {
            const response = await post('/admin/users', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Update user (admin only)
     */
    async updateUser(id: number, data: any): Promise<any> {
        try {
            const response = await put(`/admin/users/${id}`, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Delete user (admin only)
     */
    async deleteUser(id: number): Promise<void> {
        try {
            await del(`/admin/users/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default dashboardApi;
