// utils/recaptcha.js - reCAPTCHA verification

import { UnauthorizedError } from "./errors.js";
import logger from "./logger.js"; // Using centralized logger

const RECAPTCHA_CONFIG = {
  SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  MIN_SCORE: parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5,
  VERIFY_URL: "https://www.google.com/recaptcha/api/siteverify",
  TIMEOUT_MS: 10000,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};

// Log reCAPTCHA configuration on startup
logger.info("🔒 reCAPTCHA Configuration:", {
  enabled: !!RECAPTCHA_CONFIG.SECRET_KEY,
  siteKey: RECAPTCHA_CONFIG.SITE_KEY
    ? RECAPTCHA_CONFIG.SITE_KEY.substring(0, 20) + "..."
    : "NOT SET",
  minScore: RECAPTCHA_CONFIG.MIN_SCORE,
  isProduction: RECAPTCHA_CONFIG.IS_PRODUCTION,
});

export const verifyRecaptcha = async (recaptchaToken, remoteIp = null) => {
  // In development, skip if not configured
  if (!RECAPTCHA_CONFIG.IS_PRODUCTION && !RECAPTCHA_CONFIG.SECRET_KEY) {
    logger.warn(
      "⚠️ reCAPTCHA verification skipped in development (no secret key configured)"
    );
    return { success: true, score: 1.0, hostname: "localhost", bypass: true };
  }

  // In production, secret key is mandatory
  if (!RECAPTCHA_CONFIG.SECRET_KEY) {
    logger.error(
      "❌ FATAL: RECAPTCHA_SECRET_KEY is not configured in production!"
    );
    throw new UnauthorizedError("reCAPTCHA is not configured on the server");
  }

  if (!recaptchaToken) {
    throw new UnauthorizedError("reCAPTCHA token is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    RECAPTCHA_CONFIG.TIMEOUT_MS
  );

  try {
    // Build form data
    const formData = new URLSearchParams();
    formData.append("secret", RECAPTCHA_CONFIG.SECRET_KEY);
    formData.append("response", recaptchaToken);
    // Send user's IP if available (recommended by Google)
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    logger.info("🔐 Verifying reCAPTCHA token...", {
      tokenLength: recaptchaToken.length,
      remoteIpProvided: !!remoteIp,
      environment: process.env.NODE_ENV,
    });

    // Send POST request to Google's reCAPTCHA API
    const response = await fetch(RECAPTCHA_CONFIG.VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Neverland-Studio-Backend/1.0",
      },
      signal: controller.signal,
      body: formData.toString(),
    });

    if (!response.ok) {
      // Log the response body for more context on the error
      const errorBody = await response.text();
      logger.error("reCAPTCHA verification request failed with HTTP error.", {
        status: response.status,
        body: errorBody,
      });
      throw new Error(
        `reCAPTCHA API request failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    logger.info("reCAPTCHA Response:", {
      success: data.success,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data["error-codes"],
    });

    // Check basic success
    if (!data.success) {
      const errorCodes = data["error-codes"] || [];
      logger.warn("reCAPTCHA verification failed by Google.", {
        errorCodes,
        remoteIp,
      });

      if (errorCodes.includes("invalid-input-response")) {
        throw new UnauthorizedError(
          "Invalid reCAPTCHA response. Please try again."
        );
      } else if (errorCodes.includes("invalid-input-secret")) {
        // This is a server-side configuration issue.
        logger.error("FATAL: Invalid reCAPTCHA secret key used.");
        throw new UnauthorizedError(
          "reCAPTCHA configuration error on the server"
        );
      } else {
        throw new UnauthorizedError("reCAPTCHA verification failed");
      }
    }

    // For reCAPTCHA v3, check score (0.0 - 1.0)
    // v2 checkbox doesn't have a score, so this check is effectively for v3.
    if (data.score !== undefined && data.score < RECAPTCHA_CONFIG.MIN_SCORE) {
      logger.warn("reCAPTCHA score is too low, rejecting request.", {
        score: data.score,
        minScore: RECAPTCHA_CONFIG.MIN_SCORE,
        remoteIp,
      });
      // Treat low score as a failure.
      return { ...data, success: false };
    }

    return {
      success: data.success,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      // Re-throw specific unauthorized errors to be handled by the caller
      throw error;
    }

    if (error.name === "AbortError") {
      // This specific error is thrown by fetch when the AbortController is triggered.
      logger.error("reCAPTCHA verification request timed out.", {
        timeout: RECAPTCHA_CONFIG.TIMEOUT_MS,
      });
      throw new UnauthorizedError(
        "Could not verify reCAPTCHA at this time due to a network timeout."
      );
    }

    logger.error(
      "An unexpected error occurred during the reCAPTCHA verification process:",
      {
        message: error.message,
        stack: error.stack,
      }
    );

    // Throw a generic error for unexpected issues (e.g., network failure).
    throw new UnauthorizedError("Could not verify reCAPTCHA at this time.");
  } finally {
    // Always clear the timeout to prevent memory leaks and dangling timers.
    clearTimeout(timeoutId);
  }
};
