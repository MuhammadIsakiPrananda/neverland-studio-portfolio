// utils/generateToken.js
import jwt from "jsonwebtoken";

// PENTING: File ini harus menjadi satu-satunya tempat di mana token JWT dibuat.
// Ganti semua panggilan `jwt.sign()` di file lain dengan fungsi ini untuk memastikan konsistensi.

/**
 * Generates a JSON Web Token for a user.
 * @param {object} user - The user object from Sequelize. Must contain `id` and `role`.
 * @returns {string} The generated JWT.
 */
const generateToken = (user) => {
  if (!user || !user.id || !user.role) {
    throw new Error(
      "User object with id and role is required to generate a token."
    );
  }

  // Buat payload yang aman dan konsisten, hanya berisi ID dan role.
  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  // Ambil masa berlaku dari environment variable, dengan fallback ke '7d' (7 hari).
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JSON Web Token.
 * @param {string} token - The JWT to verify.
 * @returns {object} The decoded token payload.
 * @throws {Error} If the token is invalid or expired.
 */
export const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required for verification.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user; // Return the user object from the payload
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw error;
  }
};

export default generateToken;
