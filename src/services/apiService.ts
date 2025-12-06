// API Service Configuration
// Central place for all API calls and HTTP configurations

import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
} from "axios";

// Base API URL - configure based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config: any) => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common HTTP errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access denied");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error occurred");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server");
    } else {
      // Error in request setup
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API Service object with common HTTP methods
export const apiService = {
  // GET request
  get: <T = any>(url: string, config = {}) => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(url: string, data = {}, config = {}) => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(url: string, data = {}, config = {}) => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(url: string, data = {}, config = {}) => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config = {}) => {
    return apiClient.delete<T>(url, config);
  },
};

export default apiClient;
