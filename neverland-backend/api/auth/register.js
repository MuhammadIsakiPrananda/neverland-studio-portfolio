import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../../models/User.js'; // Path ke model User Sequelize
import sequelize from '../../config/database.js'; // Import instance sequelize
// import { verifyRecaptcha } from '../utils/recaptcha.js'; // Kita nonaktifkan sementara untuk debugging

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  const { name, username, email, password } = req.body;

  // 1. Validasi Input
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all required fields.' });
  }

  try {
    // Cek apakah pengguna sudah ada
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(409).json({ msg: 'User with this email or username already exists.' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat Pengguna Baru di Database
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Buat Token JWT (agar langsung login)
    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Kirim Respons Sukses
    return res.status(201).json({
      msg: 'User registered successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      },
      token,
    });

  } catch (error) {
    // LOGIKA CERDAS: Tangani jika tabel tidak ada
    if (error.name === 'SequelizeDatabaseError' && error.parent && error.parent.code === 'ER_NO_SUCH_TABLE') {
      console.warn("Table 'users' not found. Attempting to recreate it...");
      try {
        // Coba buat ulang tabel
        await sequelize.sync({ alter: true });
        console.log("Table 'users' recreated successfully. Retrying registration...");
        
        // PENTING: Panggil kembali handler ini untuk mencoba lagi registrasi
        // Ini akan menjalankan kembali seluruh logika di dalam 'try' block di atas.
        return handler(req, res);

      } catch (syncError) {
        console.error('Failed to recreate table:', syncError);
        return res.status(500).json({ msg: 'Database sync failed. Could not register user.' });
      }
    }

    // Jika errornya bukan karena tabel tidak ada, tangani seperti biasa.
    console.error('Registration Error:', error);
    return res.status(500).json({ msg: 'An internal server error occurred during registration.' });
  }
}