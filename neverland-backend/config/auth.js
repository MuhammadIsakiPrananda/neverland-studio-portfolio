// config/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// This is your primary authentication middleware.
// Use this for all routes that require a user to be logged in.
export const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, msg: 'No token provided or invalid format, authorization denied.' });
  }

  try {
    // 1. Extract token from the header
    const token = authHeader.split(' ')[1];

    // 2. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Ensure the user associated with this token still exists in the database.
    // This is a crucial security check to invalidate tokens for deleted users.
    const user = await User.findByPk(decoded.user.id, {
      // Only select necessary attributes for security and efficiency
      attributes: ['id', 'role'],
    });

    if (!user) {
      logger.warn('Authentication failed: User for token not found.', { userId: decoded.user.id });
      return res.status(401).json({ success: false, msg: 'User associated with this token no longer exists.' });
    }

    // 4. Attach user information to the request object for subsequent handlers
    req.user = user.get({ plain: true }); // Attach the clean user object (id, role)
    next(); // Proceed to the route handler
  } catch (err) {
    // Log the detailed error for server-side debugging
    logger.warn('JWT authentication failed.', { error: err.name, message: err.message });

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, msg: 'Token has expired.' });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, msg: 'Token is not valid.' });
    }
    // For other unexpected errors during verification
    return res.status(500).json({ success: false, msg: 'An internal server error occurred during authentication.' });
  }
};