const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize'); // Import Operator Sequelize
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Pastikan path ke model User sudah benar

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  // Pengecekan penting untuk JWT Secret
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    return res.status(500).json({ msg: 'Server configuration error' });
  }

  const { name, username, email, password } = req.body || {};

  // 1. Validasi Input
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // 2. Cek apakah email atau username sudah ada
    const existingUser = await User.findOne({
      where: { // Menggunakan Sequelize Operator 'or'
        [Op.or]: [{ email: email }, { username: username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ msg: 'Email is already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ msg: 'Username is already taken' });
      }
    }

    // 3. Buat instance user baru
    const newUser = User.build({ name, username, email, password });

    // 4. Enkripsi password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // 5. Simpan user ke database
    await newUser.save();

    // 6. Buat dan kirim token JWT agar user langsung login
    const payload = {
      user: {
        id: newUser.id
      }
    };

    // Menggunakan try-catch untuk penandatanganan token untuk keamanan tambahan
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (jwtError) {
      console.error('Error signing token:', jwtError);
      // Jangan teruskan jika token gagal dibuat
      return res.status(500).json({ msg: 'Server Error: Could not create session' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  // Pengecekan penting untuk JWT Secret
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    return res.status(500).json({ msg: 'Server configuration error' });
  }

  const { email, password } = req.body || {};

  // 1. Validasi Input
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    // 2. Cek apakah user ada berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Kirim pesan yang sama untuk email tidak terdaftar atau password salah
      // untuk alasan keamanan (mencegah user enumeration)
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Bandingkan password yang diinput dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 4. Jika cocok, buat dan kirim token JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    // Menggunakan try-catch untuk penandatanganan token
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (jwtError) {
      console.error('Error signing token:', jwtError);
      return res.status(500).json({ msg: 'Server Error: Could not create session' });
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;