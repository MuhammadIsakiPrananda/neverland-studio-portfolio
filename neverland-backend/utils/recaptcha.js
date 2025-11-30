// utils/recaptcha.js - reCAPTCHA verification

import { UnauthorizedError } from './errors.js';

export const verifyRecaptcha = async (recaptchaToken) => {
  if (!recaptchaToken) {
    throw new UnauthorizedError('reCAPTCHA token is required');
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      throw new UnauthorizedError('reCAPTCHA is not configured on server');
    }

    // Google reCAPTCHA verification endpoint
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    // Build form data
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', recaptchaToken);

    console.log('Verifying reCAPTCHA token...', {
      tokenLength: recaptchaToken.length,
      secretKeyConfigured: !!secretKey,
    });

    // Send POST request
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Log response untuk debugging
    console.log('reCAPTCHA Response:', {
      success: data.success,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data['error-codes'],
    });

    // Check basic success
    if (!data.success) {
      const errorCodes = data['error-codes'] || [];
      console.warn('reCAPTCHA verification failed. Error codes:', errorCodes);
      
      if (errorCodes.includes('invalid-input-response')) {
        throw new UnauthorizedError('Invalid reCAPTCHA response. Please try again.');
      } else if (errorCodes.includes('invalid-input-secret')) {
        throw new UnauthorizedError('reCAPTCHA configuration error on server');
      } else {
        throw new UnauthorizedError('reCAPTCHA verification failed');
      }
    }

    // For reCAPTCHA v3, check score (0.0 - 1.0)
    // v2 checkbox doesn't have score, so ini optional
    if (data.score !== undefined && data.score < 0.3) {
      console.warn('reCAPTCHA score too low:', data.score);
      // Masih allow, karena mungkin user legitimate tapi suspicious
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
      throw error;
    }
    
    console.error('reCAPTCHA verification error:', {
      message: error.message,
      stack: error.stack,
    });
    
    throw new UnauthorizedError('Failed to verify reCAPTCHA: ' + (error.message || 'Unknown error'));
  }
};
