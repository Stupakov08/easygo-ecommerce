require('dotenv').config();
const authServices = require('../services/auth');
const { returnError, returnAuthTokens } = require('../helpers/helpers');

const refreshTokens = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  authServices
    .refreshTokens(refreshToken)
    .then(tokens => returnAuthTokens(tokens, res))
    .catch(err => returnError(err, res));
};

const signIn = (req, res) => {
  const { email, password } = req.body;
  authServices
    .signIn({ email, password })
    .then(tokens => returnAuthTokens(tokens, res))
    .catch(err => returnError(err, res));
};

module.exports = {
  signIn,
  refreshTokens,
};
