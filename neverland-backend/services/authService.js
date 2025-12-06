// services/authService.js - Business logic for authentication
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { ApiError } from '../utils/errors.js';
import { generateToken } from '../utils/tokenUtils.js'; // Asumsi path utilitas token

/**
 * Registers a new user with email and password.
 * @param {object} userData - Contains name, username, email, and password.
 * @returns {Promise<{user: User, token: string}>} The new user and a JWT.
 */
export const registerUser = async (userData) => {
  // Menggunakan transaksi untuk memastikan atomisitas
  const t = await sequelize.transaction();
  try {
    const { name, username, email, password } = userData;

    // Cek apakah username atau email sudah ada
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
      transaction: t,
    });

    if (existingUser) {
      // Pesan error generik untuk mencegah user enumeration
      throw new ApiError(409, 'An account with this email or username already exists.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12); // Work factor lebih tinggi untuk keamanan
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = await User.create({
      name,
      username, // Normalisasi (lowercase, trim) sudah ditangani oleh hook di model User
      email,
      password: hashedPassword,
      provider: 'email',
    }, { transaction: t });

    await t.commit();

    // Hapus password dari objek user sebelum dikembalikan
    const userResponse = user.get({ plain: true });
    delete userResponse.password;

    return {
      user: userResponse,
      token: generateToken(user), // Mengirim seluruh objek user untuk payload yang konsisten
    };
  } catch (error) {
    await t.rollback();
    throw error; // Teruskan error ke handler selanjutnya
  }
};

/**
 * Authenticates a user with email and password.
 * @param {string} identifier - The user's email or username.
 * @param {string} password - The user's password.
 * @returns {Promise<{user: User, token: string}>} The authenticated user and a JWT.
 */
export const loginUser = async (identifier, password) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { username: identifier }],
    },
  });

  // Pesan error generik untuk keamanan
  const genericError = new ApiError(401, 'Invalid credentials.');
  
  if (!user) {
    throw genericError;
  }
  
  if (user.provider !== 'email' || !user.password) {
    throw new ApiError(400, `This account uses ${user.provider} login. Please sign in with ${user.provider}.`);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw genericError;
  }

  // Update last login time
  user.lastLogin = new Date();
  await user.save();

  // Hapus password dari objek user sebelum dikembalikan
  const userResponse = user.get({ plain: true });
  delete userResponse.password;

  return {
    user: userResponse,
    token: generateToken(user),
  };
};

/**
 * Handles social login (Google, GitHub, etc.).
 * Finds an existing user or creates a new one based on the social profile.
 * This function is designed to be called from within Passport strategies.
 * @param {object} profile - The profile object from Passport.js (OAuth provider).
 * @returns {Promise<User>} The found or created user.
 */
export const handleSocialLogin = async (profile) => {
  const { id: providerId, provider, displayName, emails, photos, username: profileUsername } = profile;

  if (!emails || emails.length === 0) {
    throw new ApiError(400, 'No email found in social profile.');
  }
  const email = emails[0].value; // Normalisasi ditangani oleh hook model

  // Gunakan transaksi untuk operasi "find or create" yang aman dari race condition
  return sequelize.transaction(async (t) => {
    let user = await User.findOne({ where: { email }, transaction: t });

    if (user) {
      // User ada, tautkan akun jika belum ada ID provider
      if (provider === 'google' && !user.googleId) user.googleId = providerId;
      if (provider === 'github' && !user.githubId) user.githubId = providerId;
      
      user.image = user.image || photos?.[0]?.value;
      user.lastLogin = new Date();
      await user.save({ transaction: t });
      return user;
    }

    // User tidak ada, buat user baru dengan username yang unik
    let baseUsername = (profileUsername || email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ where: { username }, transaction: t })) {
      username = `${baseUsername}${counter++}`;
    }

    return User.create({
      name: displayName,
      email: email,
      username: username,
      image: photos?.[0]?.value || null,
      provider: provider,
      googleId: provider === 'google' ? providerId : null,
      githubId: provider === 'github' ? providerId : null,
      isVerified: true,
      lastLogin: new Date(),
    }, { transaction: t });
  });
};