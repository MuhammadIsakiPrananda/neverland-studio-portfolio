// neverland-backend/config/passportGithub.js
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/User.js";
import sequelize from "./database.js"; // Import instance sequelize untuk transaksi

export default function (passport) {
  // Determine the correct callback URL based on environment
  const isProduction = process.env.NODE_ENV === "production";
  const backendUrl =
    process.env.BACKEND_URL ||
    (isProduction
      ? "https://api.neverlandstudio.my.id"
      : "http://localhost:5000");

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${backendUrl}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub kadang menyembunyikan email, kita ambil dari array emails
          const emailObj =
            profile.emails?.find((e) => e.primary) || profile.emails?.[0];
          const email = emailObj ? emailObj.value : null;

          if (!email) {
            return done(
              new Error(
                "Email tidak ditemukan di akun GitHub (Mungkin diset privat)."
              ),
              false
            );
          }

          // Gunakan transaksi untuk memastikan atomisitas operasi find-or-create
          const user = await sequelize.transaction(async (t) => {
            let existingUser = await User.findOne({
              where: { email },
              transaction: t,
            });

            if (existingUser) {
              // User ada, update githubId jika belum ada
              if (!existingUser.githubId) {
                existingUser.githubId = profile.id;
                if (!existingUser.image) {
                  existingUser.image = profile._json.avatar_url;
                }
              }
              // Update last login
              existingUser.lastLogin = new Date();
              await existingUser.save({ transaction: t });

              console.log(
                "✓ GitHub account linked/updated for existing user:",
                email
              );
              return existingUser;
            }

            // Buat User Baru jika belum ada
            let baseUsername = (profile.username || email.split("@")[0])
              .replace(/[^a-zA-Z0-9_]/g, "")
              .slice(0, 20);
            let username = baseUsername;
            let counter = 1;

            // Loop untuk memastikan username unik
            while (
              await User.findOne({ where: { username }, transaction: t })
            ) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            const newUser = await User.create(
              {
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email: email,
                username: username,
                image: profile._json.avatar_url,
                provider: "github",
                role: "user", // Set default role
                isVerified: true,
                lastLogin: new Date(),
              },
              { transaction: t }
            );

            console.log("✓ New user created via GitHub:", email);
            return newUser;
          });

          return done(null, user);
        } catch (err) {
          console.error("❌ GitHub OAuth Error:", err);
          return done(err, false, { message: err.message });
        }
      }
    )
  );
}
