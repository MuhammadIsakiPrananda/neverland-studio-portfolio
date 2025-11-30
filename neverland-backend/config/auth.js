import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Pastikan path ini benar

const router = express.Router();

// @desc    Login user with email & password
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validasi input sederhana
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi.' });
  }

  try {
    // 1. Cari user berdasarkan email
    const user = await User.findOne({ where: { email: email } });
    if (!user || !user.password) { // Juga cek jika user tidak punya password (misal, login via Google)
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // 2. Bandingkan password yang diberikan dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // 3. Jika cocok, buat dan kirim JWT
    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token: `Bearer ${token}`, // Mengirim token kembali ke frontend
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// @desc    Auth with Google (OAuth)
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=true`, session: false }), // Arahkan ke halaman login frontend jika gagal, dengan parameter error
  (req, res) => {
    // Jika autentikasi berhasil, 'req.user' akan berisi data pengguna dari database
    // Buat JWT Token
    const payload = { id: req.user.id, name: req.user.name };

    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    // Redirect ke frontend dengan token
    // Frontend bisa mengambil token ini dari URL dan menyimpannya
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  }
);

export default router;