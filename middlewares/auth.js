const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const { returnError } = require('../helpers/helpers');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided!' });
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    const data = Session.verifyAccessToken(token);

    res.userId = data.payload.userId;
    next();
  } catch (err) {
    returnError(res)(err);
  }
};
