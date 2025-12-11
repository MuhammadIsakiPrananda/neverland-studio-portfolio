// neverland-backend/utils/urlConfig.js - Flexible URL configuration for local and production
import logger from "./logger.js"; // Menggunakan logger terpusat

/**
 * Get the correct backend URL based on environment
 * Supports:
 * - localhost development (http://localhost:5000)
 * - production domains (https://api.neverlandstudio.my.id)
 * - API gateway/load balancer (via X-Forwarded-* headers)
 * - Custom BACKEND_URL from env variable
 */
export const getBackendUrl = () => {
  const backendUrl = process.env.BACKEND_URL;

  // Jika BACKEND_URL sudah di-set, gunakan itu
  if (backendUrl) {
    return backendUrl;
  }

  // Check if we're in production by looking at environment indicators
  const nodeEnv = process.env.NODE_ENV || "development";
  const isProduction =
    nodeEnv === "production" ||
    process.env.RAILWAY_ENVIRONMENT === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.RENDER_EXTERNAL_URL;

  if (isProduction) {
    // Production - use production domain
    logger.warn("BACKEND_URL not configured. Using default production domain.");
    return "https://api.neverlandstudio.my.id";
  }

  // Development - always use localhost
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}`;
};

/**
 * Get the correct frontend URL based on environment
 * Supports:
 * - localhost development (http://localhost:5173)
 * - production domains (https://neverlandstudio.my.id)
 * - Custom FRONTEND_URL from env variable
 */
export const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL;

  if (frontendUrl) {
    return frontendUrl;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://neverlandstudio.my.id";
  }

  return "http://localhost:5173";
};

/**
 * Get the correct backend URL from request headers (for API gateway/load balancer)
 * Respects X-Forwarded-* headers set by nginx/reverse proxy
 */
export const getBackendUrlFromRequest = (req) => {
  // Check for X-Forwarded-Proto and X-Forwarded-Host headers (set by nginx/proxy)
  const protocol = req.get("X-Forwarded-Proto") || req.protocol || "https";
  const host =
    req.get("X-Forwarded-Host") ||
    req.get("host") ||
    (process.env.NODE_ENV === "production"
      ? "api.neverlandstudio.my.id"
      : "localhost:5000");

  return `${protocol}://${host}`;
};

/**
 * Detect frontend origin dari berbagai sources
 * Priority: X-Forwarded headers > request origin > FRONTEND_URL > default localhost
 * Digunakan untuk Google OAuth redirect yang support multiple domains
 * IMPORTANT: Nginx harus di-config dengan proper X-Forwarded-* headers!
 */
export const detectFrontendOrigin = (req) => {
  // 1. Check X-Forwarded headers (set by nginx/proxy/cloudflare)
  const xForwardedProto = req.get("X-Forwarded-Proto");
  const xForwardedHost = req.get("X-Forwarded-Host");

  if (xForwardedProto && xForwardedHost) {
    const origin = `${xForwardedProto}://${xForwardedHost}`;
    logger.debug("Detected frontend origin from X-Forwarded headers.", {
      origin,
    });
    if (isAllowedOrigin(origin)) {
      return origin;
    }
  }

  // 2. Check Origin header dari client
  const origin = req.get("Origin");
  if (origin && isValidUrl(origin) && isAllowedOrigin(origin)) {
    return origin;
  }

  // 3. Check Referer header
  const referer = req.get("Referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      if (isAllowedOrigin(refererOrigin)) {
        return refererOrigin;
      }
    } catch (e) {
      // Invalid URL, skip
    }
  }

  // 4. Use configured FRONTEND_URL
  // Fallback to ALLOWED_REDIRECT_URIS if set
  const allowedUris = process.env.ALLOWED_REDIRECT_URIS
    ? process.env.ALLOWED_REDIRECT_URIS.split(",").map((u) => u.trim())
    : [];
  if (allowedUris.length > 0) {
    try {
      const firstUri = new URL(allowedUris[0]);
      return firstUri.origin;
    } catch (e) {
      // Invalid URL, skip
    }
  }
  return getFrontendUrl();
};

/**
 * Validate jika URL termasuk allowed origins
 * Support untuk multiple localhost ports dan production domains
 */
export const isAllowedOrigin = (urlString) => {
  // Jika production, strict validation
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.ALLOWED_REDIRECT_URIS
  ) {
    logger.warn(
      "SECURITY: ALLOWED_REDIRECT_URIS is not configured in production. OAuth redirects may fail."
    );
    return false;
  }

  // Jika development dan tidak ada ALLOWED_REDIRECT_URIS, allow all localhost
  if (
    process.env.NODE_ENV !== "production" &&
    !process.env.ALLOWED_REDIRECT_URIS
  ) {
    try {
      const url = new URL(urlString);
      return url.hostname === "localhost" || url.hostname === "127.0.0.1";
    } catch (e) {
      return false;
    }
  }

  // Check allowed URIs dari env variable
  const allowedUris = process.env.ALLOWED_REDIRECT_URIS
    ? process.env.ALLOWED_REDIRECT_URIS.split(",").map((u) => u.trim())
    : [];

  try {
    // Normalisasi URL untuk perbandingan yang lebih andal
    const requestOrigin = new URL(urlString).origin;
    return allowedUris.some((allowedUri) => {
      if (!isValidUrl(allowedUri)) return false;
      const allowedOrigin = new URL(allowedUri).origin;
      return requestOrigin === allowedOrigin;
    });
  } catch (e) {
    return false;
  }
};

/**
 * Validate URL format
 */
export const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * [REFACTORED] Generic function to get OAuth callback URL from a request.
 * @param {object} req - The Express request object.
 * @param {string} provider - The OAuth provider name (e.g., 'google', 'github').
 * @returns {string} The full callback URL.
 */
export const getOAuthCallbackUrlFromRequest = (req, provider) => {
  const backendUrl = getBackendUrlFromRequest(req);
  return `${backendUrl}/api/auth/${provider}/callback`;
};

/**
 * Validate URLs are properly configured
 * Run this during server startup
 */
export const validateUrls = () => {
  const nodeEnv = process.env.NODE_ENV || "development";
  const backendUrl = getBackendUrl();
  const frontendUrl = getFrontendUrl();
  const allowedUris = process.env.ALLOWED_REDIRECT_URIS
    ? process.env.ALLOWED_REDIRECT_URIS.split(",").map((u) => u.trim())
    : [];

  logger.info("--- URL Configuration ---");
  logger.info(`Environment: ${nodeEnv}`);
  logger.info(`Backend URL: ${backendUrl}`);
  logger.info(`Frontend URL: ${frontendUrl}`);
  if (allowedUris.length > 0 || nodeEnv === "production") {
    logger.info(`Allowed Redirect URIs: ${allowedUris.join(", ")}`);
  }

  // Validasi untuk production
  if (nodeEnv === "production") {
    const hasBackendUrl =
      process.env.BACKEND_URL && !process.env.BACKEND_URL.includes("localhost");
    const hasFrontendUrl =
      process.env.FRONTEND_URL &&
      !process.env.FRONTEND_URL.includes("localhost");

    if (!hasBackendUrl) {
      logger.warn(
        "CONFIG_WARNING: BACKEND_URL should be set to a public domain in production, not localhost."
      );
    }

    if (!hasFrontendUrl) {
      logger.warn(
        "CONFIG_WARNING: FRONTEND_URL should be set to a public domain in production, not localhost."
      );
    }

    if (!process.env.JWT_SECRET) {
      logger.error(
        "SECURITY_FATAL: JWT_SECRET is not set in production. Application will be insecure."
      );
    }

    if (!process.env.ALLOWED_REDIRECT_URIS) {
      logger.warn(
        "CONFIG_WARNING: ALLOWED_REDIRECT_URIS should be configured in production for OAuth to work correctly."
      );
    }

    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      logger.warn(
        "CONFIG_WARNING: GitHub OAuth credentials are not configured for production."
      );
    }
  }
  logger.info("-------------------------");

  // Validate URLs format
  try {
    new URL(backendUrl);
    new URL(frontendUrl);
  } catch (err) {
    logger.error("Invalid URL format in environment variables.", {
      error: err.message,
    });
    throw new Error("Invalid URL configuration");
  }
};

/**
 * [REFACTORED] Generic function to build a success redirect URL for the frontend.
 * @param {string} token - The JWT.
 * @param {object} userData - The public user data.
 * @param {string|null} frontendOrigin - The detected origin of the frontend.
 * @returns {string} The full redirect URL with token and user data.
 */
export const getSuccessRedirectUrl = (
  token,
  userData,
  frontendOrigin = null
) => {
  const baseUrl = frontendOrigin || getFrontendUrl();
  const encodedToken = encodeURIComponent(token);
  const encodedUser = encodeURIComponent(JSON.stringify(userData));

  // Redirect to a dedicated page to handle token processing, then redirect to the final destination.
  return `${baseUrl}/auth-success?auth_success=true&token=${encodedToken}&user=${encodedUser}`;
};

/**
 * [REFACTORED] Generic function to build a success redirect URL using the request context.
 * @param {object} req - The Express request object.
 * @param {string} token - The JWT.
 * @param {object} userData - The public user data.
 * @returns {string} The full redirect URL.
 */
export const getSuccessRedirectUrlFromRequest = (req, token, userData) => {
  const clientOrigin = detectFrontendOrigin(req);
  return getSuccessRedirectUrl(token, userData, clientOrigin);
};

/**
 * [REFACTORED] Generic function to build an error redirect URL for the frontend.
 * @param {string} errorCode - A short code for the error type.
 * @param {string} details - A more detailed error message.
 * @param {string|null} frontendOrigin - The detected origin of the frontend.
 * @returns {string} The full redirect URL with error info.
 */
export const getErrorRedirectUrl = (
  errorCode,
  details = "",
  frontendOrigin = null
) => {
  const baseUrl = frontendOrigin || getFrontendUrl();
  let url = `${baseUrl}/auth?error=${errorCode}`;

  if (details) {
    url += `&details=${encodeURIComponent(details)}`;
  }

  return url;
};

/**
 * [REFACTORED] Generic function to build an error redirect URL using the request context.
 * @param {object} req - The Express request object.
 * @param {string} errorCode - A short code for the error type.
 * @param {string} details - A more detailed error message.
 * @returns {string} The full redirect URL.
 */
export const getErrorRedirectUrlFromRequest = (
  req,
  errorCode,
  details = ""
) => {
  const clientOrigin = detectFrontendOrigin(req);
  return getErrorRedirectUrl(errorCode, details, clientOrigin);
};

/**
 * Environment info untuk debugging
 */
export const getEnvironmentInfo = () => {
  const allowedUris = process.env.ALLOWED_REDIRECT_URIS
    ? process.env.ALLOWED_REDIRECT_URIS.split(",").map((u) => u.trim())
    : [];

  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    backendUrl: getBackendUrl(),
    frontendUrl: getFrontendUrl(),
    allowedRedirectUris: allowedUris,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasGoogleAuth:
      !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    hasGithubAuth:
      !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET,
    isDevelopment: (process.env.NODE_ENV || "development") === "development",
    isProduction: process.env.NODE_ENV === "production",
  };
};

export default {
  getBackendUrl,
  getFrontendUrl,
  getBackendUrlFromRequest,
  detectFrontendOrigin,
  isAllowedOrigin,
  isValidUrl,
  getOAuthCallbackUrlFromRequest,
  getSuccessRedirectUrl,
  getSuccessRedirectUrlFromRequest,
  getErrorRedirectUrl,
  getErrorRedirectUrlFromRequest,
  validateUrls,
  getEnvironmentInfo,
};
