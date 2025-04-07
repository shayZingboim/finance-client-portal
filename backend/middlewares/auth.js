const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'לא סופק טוקן' });
  }

  try {
	// Decode the token and verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'טוקן לא תקף' });
  }
};

// Middleware to check if the user is an admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'גישה רק למנהלים' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
};
