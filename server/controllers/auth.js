require('dotenv').config();
const authServices = require('../services/auth');

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;

  authServices
    .refreshTokens(refreshToken)
    .then(tokens => res.json(tokens))
    .catch(err => res.status(400).json({ message: err.message }));
};

const signIn = (req, res) => {
  const { email, password } = req.body;

  authServices
    .signIn({ email, password })
    .then(tokens => res.json(tokens))
    .catch(err => res.status(500).json({ message: err.message }));
};

module.exports = {
  signIn,
  refreshTokens,
};
