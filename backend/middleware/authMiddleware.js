const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const raw =
    req.headers.authorization || req.headers.Authorization;
  if (!raw) return res.status(403).json({ error: 'Token required' });
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;

  jwt.verify(token, 'mysecret123', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

module.exports = authMiddleware;
