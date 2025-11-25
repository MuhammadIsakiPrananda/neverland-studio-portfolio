import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../../models/User.js'; // Path ke model User Sequelize

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  const { identifier, password } = req.body;

  // 1. Validasi Input
  if (!identifier || !password) {
    return res.status(400).json({ msg: 'Email/Username and password are required.' });
  }

  try {
    // 2. Cari Pengguna di Database
    const user = await User.findOne({
      where: { [Op.or]: [{ email: identifier }, { username: identifier }] },
    });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials. Please check your email/username and password.' });
    }

    // 3. Bandingkan Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Invalid credentials. Please check your email/username and password.' });
    }

    // 4. Buat Token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 5. Kirim Respons Sukses
    // Frontend Anda mengharapkan `data.user` dan `token`
    res.status(200).json({
      msg: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token,
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}