import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import axios from 'axios'; // Import axios untuk membuat request HTTP
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Mengubah jwt.sign menjadi fungsi berbasis Promise agar bisa digunakan dengan async/await
// Ini adalah praktik modern yang lebih aman daripada menggunakan callback.
const signJwt = promisify(jwt.sign);

import { Op } from 'sequelize';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  // Terima `recaptchaToken` bersama data lainnya
  const { name, username, email, password, recaptchaToken } = req.body;

  // Validasi JWT_SECRET di awal untuk mencegah error yang tidak jelas
  if (!process.env.JWT_SECRET || !process.env.RECAPTCHA_SECRET_KEY) {
    console.error('FATAL ERROR: JWT_SECRET or RECAPTCHA_SECRET_KEY is not defined in .env file.');
    return res.status(500).json({ msg: 'Server configuration error. Please contact administrator.' });
  }

  try {
    // --- Langkah Validasi reCAPTCHA ---
    // 1. Pastikan token reCAPTCHA dikirim dari frontend
    if (!recaptchaToken) {
      return res.status(400).json({ msg: 'reCAPTCHA verification is required.' });
    }

    // 2. Kirim token ke Google untuk verifikasi
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    const recaptchaResponse = await axios.post(verifyUrl);
    const { success, score } = recaptchaResponse.data;

    // 3. Periksa hasil verifikasi
    // `success` harus true. Untuk reCAPTCHA v3, kita juga bisa memeriksa `score`.
    // Untuk v2 (checkbox), cukup periksa `success`.
    if (!success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResponse.data['error-codes']);
      return res.status(400).json({ msg: 'Failed to verify reCAPTCHA. Please try again.' });
    }

    // --- Akhir Langkah Validasi reCAPTCHA ---

    // Pengecekan Email dan Username yang Sudah Ada (dibuat lebih efisien)
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ msg: 'User with this email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ msg: 'This username is already taken' });
      }
    }
    // Buat user baru (hook hashing password akan berjalan otomatis)
    let user = await User.create({ name, username, email, password });

    // Siapkan data user yang akan dikirim kembali (tanpa password)
    const userResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    };

    // Buat token JWT
    const payload = { user: { id: user.id } };
    const token = await signJwt(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

    // Kirim token dan data user sebagai respons
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    console.error(err.message);
    // Selalu kirim JSON, bahkan saat error
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
export const login = async (req, res) => { 
  const { identifier, password } = req.body;

  // Validasi JWT_SECRET di awal
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    return res.status(500).json({ msg: 'Server configuration error. Please contact administrator.' });
  }

  try {
    // Sekarang kita bisa login dengan email ATAU username
    let user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }]
      }
    });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials. Please check your email and password.' });
    }

    const userResponse = { id: user.id, name: user.name, username: user.username, email: user.email };

    const payload = { user: { id: user.id } };
    const token = await signJwt(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error(err.message);
    // Selalu kirim JSON, bahkan saat error
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};