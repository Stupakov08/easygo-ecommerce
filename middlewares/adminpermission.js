const jwt = require('jsonwebtoken');
const AdminSession = require('../models/admin/session');
const { returnError } = require('../helpers/helpers');

module.exports = (req, res, next) => {
  if (req.superadmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden!' });
  }
};
