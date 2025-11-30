import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { validateRegistrationInput, sanitizeString } from '../utils/validation.js';
import { verifyRecaptcha } from '../utils/recaptcha.js';
import { ValidationError, ConflictError, InternalError } from '../utils/errors.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    // Validasi konfigurasi
    if (!process.env.JWT_SECRET || !process.env.RECAPTCHA_SECRET_KEY) {
      console.error('FATAL ERROR: JWT_SECRET or RECAPTCHA_SECRET_KEY is not defined.');
      throw new InternalError('Server configuration error');
    }

    // 1. Validasi input
    let { name, username, email, password, recaptchaToken } = req.body;

    const validation = validateRegistrationInput({ name, username, email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        msg: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Sanitasi input
    name = sanitizeString(name);
    username = sanitizeString(username).toLowerCase();
    email = sanitizeString(email).toLowerCase();

    // 2. Verifikasi reCAPTCHA
    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        msg: 'reCAPTCHA verification is required',
      });
    }

    try {
      await verifyRecaptcha(recaptchaToken);
    } catch (err) {
      console.error('reCAPTCHA verification failed during registration:', err.message);
      return res.status(400).json({
        success: false,
        msg: 'reCAPTCHA verification failed. Please try again.',
        details: { recaptcha: err.message },
      });
    }

    // 3. Cek apakah email atau username sudah terdaftar
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          msg: 'This email is already registered',
          field: 'email',
        });
      }
      if (existingUser.username === username) {
        return res.status(409).json({
          success: false,
          msg: 'This username is already taken',
          field: 'username',
        });
      }
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Buat user baru
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      provider: 'email',
    });

    // 6. Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 7. Kirim respons sukses
    res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred during registration',
    });
  }
};


// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @note    Login does NOT require reCAPTCHA - only Register does
export const login = async (req, res, next) => {
  try {
    // Validasi konfigurasi
    if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET is not defined.');
      throw new InternalError('Server configuration error');
    }

    let { identifier, password } = req.body;

    // 1. Validasi input dasar
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Email/username and password are required',
      });
    }

    // Sanitasi input
    identifier = sanitizeString(identifier).toLowerCase();

    // 3. Cari user berdasarkan email atau username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      // Jangan berikan informasi yang berbeda untuk email vs username
      return res.status(401).json({
        success: false,
        msg: 'Invalid email/username or password',
      });
    }

    // 4. Cek jika user terdaftar via Google dan tidak punya password
    if (!user.password) {
      return res.status(401).json({
        success: false,
        msg: 'This account is registered with Google. Please use "Sign in with Google"',
        provider: 'google',
      });
    }

    // 5. Bandingkan password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid email/username or password',
      });
    }

    // 6. Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 7. Kirim respons sukses
    res.status(200).json({
      success: true,
      msg: 'Login successful',
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred during login',
    });
  }
};
