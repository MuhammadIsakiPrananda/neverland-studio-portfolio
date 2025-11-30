// config/configRoutes.js - Public configuration endpoints
import { Router } from 'express';

const router = Router();

// @desc    Get reCAPTCHA public configuration
// @route   GET /api/config/recaptcha
router.get('/recaptcha', (req, res) => {
  try {
    const siteKey = process.env.RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured');
      return res.status(503).json({
        success: false,
        msg: 'reCAPTCHA is not configured on server',
      });
    }

    res.json({
      success: true,
      siteKey,
    });
  } catch (err) {
    console.error('Config error:', err.message);
    res.status(500).json({
      success: false,
      msg: 'Failed to retrieve configuration',
    });
  }
});

// @desc    Test reCAPTCHA token verification (debug only)
// @route   POST /api/config/test-recaptcha
router.post('/test-recaptcha', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        msg: 'Token is required',
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      return res.status(503).json({
        success: false,
        msg: 'reCAPTCHA secret key not configured',
      });
    }

    // Test verification
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    res.json({
      success: true,
      verification: data,
      debug: {
        tokenReceived: token.substring(0, 20) + '...',
        secretKeyConfigured: !!secretKey,
        secretKeyPrefix: secretKey ? secretKey.substring(0, 10) + '...' : 'N/A',
      },
    });
  } catch (err) {
    console.error('Test reCAPTCHA error:', err.message);
    res.status(500).json({
      success: false,
      msg: 'Failed to test reCAPTCHA',
      error: err.message,
    });
  }
});

export default router;
