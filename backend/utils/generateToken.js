const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for an authenticated user
 * @param {Object} user - User object containing id, email, role, name
 * @returns {string} Signed JWT token string
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'fallback_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

module.exports = generateToken;
