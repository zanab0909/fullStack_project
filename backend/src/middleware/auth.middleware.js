const jwt = require('jsonwebtoken');

// This middleware protects routes that require a logged-in user.
// It checks if a valid JWT token is present in the request headers.
const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header
  //    The header should look like: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  // 2. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next(); // Token is valid — move to the next function
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// This middleware allows access only to admins.
// Must be used AFTER the protect middleware.
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
    });
  }
  next();
};

module.exports = { protect, adminOnly };
