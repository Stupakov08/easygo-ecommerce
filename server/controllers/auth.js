require('dotenv').config();
const authServices = require('../services/auth');
const { returnError, returnAuthTokens } = require('../helpers/helpers');

const refreshTokens = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { fingerprint } = req.body;

  authServices
    .refreshTokens(refreshToken, fingerprint)
    .then(returnAuthTokens(res))
    .catch(returnError(res));
};

const signIn = (req, res) => {
  const { email, password, fingerprint } = req.body;
  authServices
    .signIn({ email, password, fingerprint })
    .then(returnAuthTokens(res))
    .catch(returnError(res));
};

module.exports = {
  signIn,
  refreshTokens,
};
