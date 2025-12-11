// neverland-backend/config/passport.js - FIXED VERSION
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import sequelize from './database.js'; // Import instance sequelize untuk transaksi

export default function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback", // URL Relatif untuk proxy/nginx
        proxy: true, // PENTING: Agar trust X-Forwarded-Proto dari nginx/cloudflare
        passReqToCallback: true, // PENTING: Agar bisa akses req di callback
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          
          if (!email) {
            return done(new Error('No email found in Google profile'), false);
          }

          // Gunakan transaksi untuk memastikan atomisitas operasi find-or-create
          const user = await sequelize.transaction(async (t) => {
            // 1. Cek apakah user sudah ada berdasarkan email
            let existingUser = await User.findOne({ where: { email }, transaction: t });

            if (existingUser) {
              // User ada, update googleId jika belum ada
              if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
                if (!existingUser.image) {
                  existingUser.image = profile.photos?.[0]?.value;
                }
              }
              
              // Update last login
              existingUser.lastLogin = new Date();
              await existingUser.save({ transaction: t });

              console.log('✓ Google account linked/updated for existing user:', email);
              return existingUser;
            }

            // 2. Jika user belum ada, buat user baru
            // Generate username unik dari email
            let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
            let username = baseUsername;
            let counter = 1;
            
            // Loop untuk memastikan username unik
            while (await User.findOne({ where: { username }, transaction: t })) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            const newUser = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              username: username,
              image: profile.photos?.[0]?.value,
              provider: 'google',
              role: 'user', // PENTING: Set default role
              isVerified: true, 
              lastLogin: new Date()
            }, { transaction: t });

            console.log('✓ New user created via Google:', email);
            return newUser;
          });

          // Jika transaksi berhasil, `user` akan berisi pengguna yang ditemukan atau yang baru dibuat.
          return done(null, user);

        } catch (err) {
          console.error('❌ Google OAuth Error:', err);
          return done(err, false);
        }
      }
    )
  );
}