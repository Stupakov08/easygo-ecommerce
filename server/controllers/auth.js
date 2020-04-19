const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models').User;
const Token = require('../models').Token;

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;

  try {
    payload = Token.verifyRefresh(refreshToken);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: 'Token expired!' });
    }
    return res.status(400).json({ message: 'Invalid token!' });
  }

  Token.findOne({ tokenId: payload.id })
    .exec()
    .then((token) => {
      if (token === null) {
        throw new Error('Invalid token!');
      }
      return Token.updateTokens(token.userId);
    })
    .then((tokens) => res.json(tokens))
    .catch((err) => res.status(400).json({ message: err.message }));
};

const signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'User does not exist!' });
      }
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        Token.updateTokens(user._id).then((tokens) => res.json(tokens));
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports = {
  signIn,
  refreshTokens,
};
