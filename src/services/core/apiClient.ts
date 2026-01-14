/**
 * Core API Client
 * 
 * Centralized axios instance with interceptors, error handling,
 * and retry logic for all API requests.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getApiUrl } from '../../config/api.config';
import type { ApiResponse, ApiError } from '../../types';

// Base API URL from configuration
const API_BASE_URL = getApiUrl();

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000, // 15 seconds
    withCredentials: true, // Enable CORS credentials
});

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles errors and token expiration
 */
apiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            const authMode = localStorage.getItem('auth_mode');

            // Only handle logout for backend auth mode
            if (authMode === 'backend' && !originalRequest._retry) {
                // Clear auth data
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                localStorage.removeItem('auth_mode');
                localStorage.removeItem('userProfile');

                // Show notification
                const { showWarning } = await import('../../components/common/ModernNotification');
                showWarning(
                    'Session Expired ⏱️',
                    'Your session has expired. Please login again.'
                );

                // Redirect to home
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        }

        // Handle network errors
        if (error.code === 'ECONNABORTED') {
            console.error('[API Timeout]', error.config?.url);
        } else if (error.code === 'ERR_NETWORK') {
            console.error('[Network Error]', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error: any): ApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;

        return {
            success: false,
            message: axiosError.response?.data?.message || error.message || 'An error occurred',
            errors: axiosError.response?.data?.errors,
            code: axiosError.code,
            status: axiosError.response?.status,
        };
    }

    return {
        success: false,
        message: error.message || 'An unexpected error occurred',
    };
};

/**
 * Generic GET request
 */
export const get = async <T = any>(
    url: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.get<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generic POST request
 */
export const post = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.post<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generic PUT request
 */
export const put = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.put<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generic PATCH request
 */
export const patch = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generic DELETE request
 */
export const del = async <T = any>(
    url: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.delete<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Export the axios instance for direct use if needed
export default apiClient;
