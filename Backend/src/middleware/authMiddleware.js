const jwt = require('jsonwebtoken');

// Middleware to authenticate users
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware to authenticate admin users
function authenticateAdminToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.admin = admin;
    next();
  });
}

// Middleware to authorize users by role
function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (req.admin?.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authenticateAdminToken,
  authorizeRole,
};
