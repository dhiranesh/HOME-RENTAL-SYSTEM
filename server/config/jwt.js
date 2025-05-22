const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, userRole) => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in the environment variables.');
    process.exit(1);
  }
  if (!process.env.JWT_EXPIRES_IN) {
    console.warn('Warning: JWT_EXPIRES_IN is not defined. Using default expiration (e.g., 1h).');
  }
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined for verification.');
    throw new Error('JWT_SECRET not configured, cannot verify token.');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };
