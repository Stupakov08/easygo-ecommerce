const jwt = require('jsonwebtoken');
const Token = require('../models').Token;

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided!' });
  }

  const token = authHeader.replace('Barear ', '');
  try {
    Token.verifyAccessToken(token);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired!' });
      return;
    }
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token!' });
    }
  }

  next();
};
