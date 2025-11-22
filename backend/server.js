import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors()); // Mengizinkan request dari domain lain (frontend Anda)
app.use(express.json()); // Mem-parsing body request sebagai JSON

// Inisialisasi database SQLite
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Buat tabel 'users' jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);
  }
});

// Endpoint untuk Registrasi Pengguna
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Enkripsi (Hash) kata sandi sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed: users.email')) {
          return res.status(409).json({ message: 'Email address is already registered.' });
        }
        return res.status(500).json({ message: 'An error occurred during registration.' });
      }
      res.status(201).json({ message: 'User registered successfully!', user: { id: this.lastID, name, email } });
    });
  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Endpoint untuk Login
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required.' });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [identifier], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'An internal server error occurred.' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }
    
    // Bandingkan password yang diberikan dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }
    
    // Jika login berhasil, kirim data user tanpa password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Login successful!', user: userWithoutPassword });
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
