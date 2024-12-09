const jwt = require('jsonwebtoken');


exports.authenticateAdminToken=(req, res, next) =>{
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.admin = admin; // Attach admin info to request
    next();
  });
}
