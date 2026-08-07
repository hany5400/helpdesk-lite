const jwt = require('jsonwebtoken');

/**
 * Protect routes by verifying JWT in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      
      req.user = decoded; // Attach user payload (id, name, email, role)
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided.'
    });
  }
};

/**
 * Authorize specified roles for protected endpoints
 * @param  {...string} roles Allowed roles ('employee', 'support', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'none'}' does not have permission to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
