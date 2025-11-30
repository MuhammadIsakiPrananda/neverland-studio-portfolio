import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
      proxy: true, // Penting jika aplikasi berjalan di belakang proxy (Nginx, Heroku, dll)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Validasi data dari Google
        if (!profile.id || !profile.emails || profile.emails.length === 0) {
          console.error('Invalid Google profile data');
          return done(new Error('Invalid Google profile data'), false);
        }

        const newUser = {
          googleId: profile.id,
          name: profile.displayName || 'Google User',
          email: profile.emails[0].value,
          image: profile.photos?.[0]?.value || null,
        };

        // 2. Cari user berdasarkan email
        let user = await User.findOne({ where: { email: newUser.email } });

        if (user) {
          // 3a. User sudah ada
          if (!user.googleId) {
            // Update googleId jika belum ada (misal: user daftar via email lalu login Google)
            user.googleId = newUser.googleId;
            await user.save();
          }
          return done(null, user);
        }

        // 3b. Buat user baru dengan username yang unik
        let username = newUser.email.split('@')[0]
          .replace(/[^a-zA-Z0-9_]/g, '_')
          .toLowerCase()
          .substring(0, 20); // Limit ke 20 karakter

        let isUsernameUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUsernameUnique && attempts < maxAttempts) {
          const randomSuffix = Math.floor(Math.random() * 10000);
          const testUsername = attempts === 0 ? username : `${username}_${randomSuffix}`;
          
          const existingUsername = await User.findOne({ where: { username: testUsername } });
          if (!existingUsername) {
            username = testUsername;
            isUsernameUnique = true;
          }
          attempts++;
        }

        if (!isUsernameUnique) {
          console.error('Failed to generate unique username after 10 attempts');
          return done(new Error('Failed to create user account'), false);
        }

        // 4. Buat user baru
        user = await User.create({
          name: newUser.name,
          email: newUser.email,
          username: username,
          googleId: newUser.googleId,
          image: newUser.image,
          provider: 'google',
          // password tetap null untuk user Google
        });

        return done(null, user);
      } catch (err) {
        console.error('Passport Google Strategy Error:', err.message);
        return done(err, false);
      }
    }
  )
);

// Jangan set serializeUser/deserializeUser karena kita tidak menggunakan session
