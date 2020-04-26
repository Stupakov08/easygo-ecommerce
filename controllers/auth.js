require('dotenv').config();
const authServices = require('../services/auth');
const { returnError, returnAuthTokens } = require('../helpers/helpers');

const signUp = async (req, res) => {
  const { name, email, password, passwordconf, fingerprint } = req.body;

  authServices
    .signUp({ name, email, password, passwordconf, fingerprint })
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

const refreshTokens = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { fingerprint } = req.body;

  authServices
    .refreshTokens(refreshToken, fingerprint)
    .then(returnAuthTokens(res))
    .catch(returnError(res));
};

const verifyEmail = (req, res) => {
  const token = req.params.token;

  authServices
    .verifyEmail(token)
    .then(() => res.status(200).json({}))
    .catch(returnError(res));
};

module.exports = {
  signUp,
  signIn,
  refreshTokens,
  verifyEmail,
};
