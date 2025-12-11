// utils/apiHelper.js - Helper untuk API calls yang fleksibel

// Definisikan kunci token sebagai konstanta untuk konsistensi di seluruh aplikasi frontend.
export const AUTH_TOKEN_KEY = "authToken";

// Error kustom untuk membawa lebih banyak detail dari respons API.
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Get API base URL untuk frontend/client
 * Mengandalkan environment variable yang di-set saat build (Vite/Next.js).
 * Contoh: VITE_API_BASE_URL=http://localhost:5000 di .env.development
 *         VITE_API_BASE_URL=https://api.neverlandstudio.my.id di .env.production
 */
export const getApiBaseUrl = () => {
  // Gunakan variabel lingkungan dari build tool Anda (misalnya, Vite atau Next.js)
  // Pastikan nama variabel ini (VITE_API_BASE_URL atau NEXT_PUBLIC_API_URL) sesuai dengan proyek Anda.
  const apiUrl =
    import.meta.env.VITE_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error(
      "FATAL: API Base URL environment variable (e.g., VITE_API_BASE_URL) is not set."
    );
    // Fallback based on environment
    const isProduction =
      import.meta.env.PROD || process.env.NODE_ENV === "production";
    return isProduction
      ? "https://api.neverlandstudio.my.id"
      : "http://localhost:5000";
  }

  return apiUrl;
};

/**
 * Make authenticated API request dengan error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add auth token if available
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    defaultOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Lempar error kustom dengan lebih banyak detail
      throw new ApiError(
        data?.msg || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    console.error(
      `API Call Failed [${finalOptions.method || "GET"} ${endpoint}]:`,
      error
    );
    throw error;
  }
};

/**
 * Shortcut methods untuk common HTTP verbs
 */
export const api = {
  get: (endpoint, options) => apiCall(endpoint, { method: "GET", ...options }),
  post: (endpoint, data, options) =>
    apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }),
  put: (endpoint, data, options) =>
    apiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),
  patch: (endpoint, data, options) =>
    apiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    }),
  delete: (endpoint, options) =>
    apiCall(endpoint, { method: "DELETE", ...options }),
};

/**
 * Health check helper
 */
export const checkApiHealth = async () => {
  try {
    const response = await api.get("/api/health");
    return response.status === "OK";
  } catch {
    return false;
  }
};

/**
 * Get API config info (development only)
 */
export const getApiConfig = async () => {
  try {
    const config = await api.get("/api/debug/env");
    return config.environment;
  } catch {
    return null;
  }
};

export default {
  getApiBaseUrl,
  apiCall,
  api,
  checkApiHealth,
  getApiConfig,
};
