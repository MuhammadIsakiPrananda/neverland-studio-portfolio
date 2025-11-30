import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// @desc    Initiate Google OAuth flow
// @route   GET /api/auth/google
router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: Math.random().toString(36).substring(7), // Tambah state untuk security
  })(req, res, next);
});

// @desc    Google OAuth callback handler
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      // Jika autentikasi berhasil, 'req.user' akan berisi data pengguna dari database
      if (!req.user || !req.user.id) {
        console.error('User data not found in request');
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=user_not_found`
        );
      }

      // Validasi JWT_SECRET
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=server_error`
        );
      }

      // Generate JWT token
      const payload = { user: { id: req.user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Redirect ke frontend dengan token
      const redirectUrl = `${
        process.env.FRONTEND_URL || 'http://localhost:5173'
      }/auth-success?token=${encodeURIComponent(token)}&user=${encodeURIComponent(
        JSON.stringify({
          id: req.user.id,
          name: req.user.name,
          username: req.user.username,
          email: req.user.email,
          image: req.user.image,
        })
      )}`;

      res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google callback error:', err.message);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=callback_error`
      );
    }
  }
);

export default router;
