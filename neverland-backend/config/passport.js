import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails[0].value;

      try {
        // 1. Cek apakah pengguna dengan googleId ini sudah ada
        let user = await User.findOne({ where: { googleId: googleId } });

        if (user) {
          return done(null, user);
        }

        // 2. Jika tidak ada, cek apakah ada pengguna dengan email yang sama (sudah daftar manual)
        user = await User.findOne({ where: { email: email } });

        if (user) {
          // Jika ada, tautkan akun Google ini ke pengguna yang sudah ada
          user.googleId = googleId;
          user.image = user.image || profile.photos[0].value; // Update gambar jika belum ada
          await user.save();
          return done(null, user);
        }

        // 3. Jika tidak ada sama sekali, buat pengguna baru
        // Membuat username unik dari email dan menambahkan angka acak untuk menghindari duplikasi
        const usernameFromEmail = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(100 + Math.random() * 900);

        const newUser = {
          googleId: googleId,
          email: email,
          name: profile.displayName, // Mengisi kolom 'name' yang wajib
          username: usernameFromEmail, // Mengisi kolom 'username' yang wajib dan unik
          image: profile.photos[0].value,
          // Kolom password dibiarkan null, karena model sudah mengizinkannya
        };

        user = await User.create(newUser);
        return done(null, user);
      } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});