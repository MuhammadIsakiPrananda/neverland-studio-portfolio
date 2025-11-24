// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('./controllers/authController'); // Path ini sekarang benar

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

module.exports = router;