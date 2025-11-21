const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors()); // Mengizinkan request dari domain lain (frontend Anda)
app.use(express.json()); // Mem-parsing body request sebagai JSON

// Contoh Route untuk Login
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' });
  }

  try {
    // Query ke database untuk mencari user
    // Gunakan '?' untuk mencegah SQL Injection
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [identifier, identifier, password] // Asumsi password belum di-hash, ini tidak aman untuk produksi!
    );

    if (rows.length > 0) {
      const user = rows[0];
      // Jangan kirim password ke frontend
      delete user.password;
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
