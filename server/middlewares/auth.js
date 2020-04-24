const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const { returnError } = require('../helpers/helpers');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided!' });
  }

  const token = authHeader.replace('Barear ', '');
  try {
    Session.verifyAccessToken(token);
  } catch (err) {
    returnError(res)(err);
  }

  next();
};
