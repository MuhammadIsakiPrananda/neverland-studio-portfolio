const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  // Terima `recaptchaToken` bersama data lainnya
  const { name, username, email, password } = req.body;

  try {
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
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, user: userResponse });
    });

  } catch (err) {
    console.error(err.message);
    // Selalu kirim JSON, bahkan saat error
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => { 
  const { identifier, password } = req.body;

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
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: userResponse });
    });

  } catch (err) {
    console.error(err.message);
    // Selalu kirim JSON, bahkan saat error
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};