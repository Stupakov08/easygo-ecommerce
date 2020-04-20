require('dotenv').config();
const authServices = require('../services/auth');
const returnError = require('../helpers/returnError');

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;

  authServices
    .refreshTokens(refreshToken)
    .then(tokens => res.json(tokens))
    .catch(err => returnError(err, res));
};

const signIn = (req, res) => {
  const { email, password } = req.body;

  authServices
    .signIn({ email, password })
    .then(tokens => res.json(tokens))
    .catch(err => returnError(err, res));
};

module.exports = {
  signIn,
  refreshTokens,
};
