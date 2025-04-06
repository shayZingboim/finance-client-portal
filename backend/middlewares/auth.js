const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // שינוי חשוב!

  if (!token) {
    return res.status(401).json({ message: 'לא סופק טוקן' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'טוקן לא תקף' });
  }
};

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
