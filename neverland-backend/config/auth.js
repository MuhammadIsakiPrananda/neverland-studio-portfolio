// config/auth.js - JWT Verification Middleware
import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memverifikasi JWT token dari header Authorization
 * Menambahkan user data ke req.user jika token valid
 */
export const verifyJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Cek apakah Authorization header ada dan mengikuti format "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      msg: 'No token provided. Authorization denied.',
    });
  }

  try {
    // Extract token dari "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tambahkan user data ke request object
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        msg: 'Token has expired',
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        msg: 'Invalid token',
      });
    }

    res.status(401).json({
      success: false,
      msg: 'Token is not valid',
    });
  }
};

export default verifyJWT;
