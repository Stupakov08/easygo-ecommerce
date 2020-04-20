const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models').User;
const Token = require('../models').Token;

const refreshTokens = refreshToken => {
  let payload;

  try {
    payload = Token.verifyRefreshToken(refreshToken);
  } catch (e) {
    return new Promise(() => {
      throw e instanceof jwt.TokenExpiredError
        ? new Error('Token expired!')
        : new Error('Invalid token!');
    });
  }

  return Token.findOne({ tokenId: payload.id })
    .exec()
    .then(token => {
      if (!token) throw new Error('Invalid token!');
      return Token.updateTokens(token.userId);
    });
};

const signIn = ({ email, password }) => {
  return User.findOne({ email })
    .exec()
    .then(user => {
      if (!user) throw new Error('User does not exist!');

      const isValid = bcrypt.compareSync(password, user.password);

      if (isValid) return Token.updateTokens(user._id);

      throw new Error('Invalid credentials');
    });
};

module.exports = {
  refreshTokens,
  signIn,
};
