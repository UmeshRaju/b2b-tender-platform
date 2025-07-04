const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This adds { id } from the token to req.user
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

module.exports = auth;
