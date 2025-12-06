import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import sequelize from './database.js';
import logger from '../utils/logger.js';

const configureGoogleStrategy = (passport) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    logger.warn('⚠️  Google OAuth environment variables not set. Google login will be disabled.');
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    scope: ['profile', 'email']
  },
    async (accessToken, refreshToken, profile, done) => {
      const t = await sequelize.transaction();

      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error('Google profile did not return an email address.'), false);
        }

        let user = await User.findOne({ where: { googleId: profile.id }, transaction: t });

        if (user) {
          user.lastLogin = new Date();
          await user.save({ transaction: t });
          await t.commit();
          return done(null, user);
        }

        user = await User.findOne({ where: { email: email }, transaction: t });

        if (user) {
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save({ transaction: t });
          await t.commit();
          return done(null, user);
        }

        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName || 'New User',
          email: email,
          username: profile.id,
          provider: 'google',
          isVerified: true,
          image: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        }, { transaction: t });

        await t.commit();
        return done(null, newUser);
      } catch (error) {
        await t.rollback();
        logger.error('Google Strategy Error:', error);
        return done(error, false);
      }
    }
  ));
};

export default configureGoogleStrategy;