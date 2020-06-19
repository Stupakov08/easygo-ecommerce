const jwt = require('jsonwebtoken');
const AdminSession = require('../models/admin/session');
const { returnError } = require('../helpers/helpers');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided!' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { payload } = AdminSession.verifyAccessToken(token);
    req.superadmin = payload.superadmin;
    next();
  } catch (err) {
    returnError(res)(err);
  }
};
