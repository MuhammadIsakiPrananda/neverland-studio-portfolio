const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize'); // Import Operator Sequelize
const User = require('./models/User'); // Pastikan path ke model User sudah benar

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;

  // Validasi sederhana
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // 1. Cek apakah email atau username sudah ada
    const existingUser = await User.findOne({
      where: {
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

    // Buat instance user baru
    const newUser = User.build({ name, username, email, password });

    // 2. Enkripsi password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // 3. Simpan user ke database
    await newUser.save();

    // Kirim respons sukses (tanpa password)
    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;