const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models').User;
const Token = require('../models').Token;
const {
  TokenExpiredError,
  TokenInvalidError,
  UserDoesNotExistError,
  InvalidCredentialsError,
} = require('../helpers/errors');

const refreshTokens = refreshToken => {
  let payload;

  try {
    payload = Token.verifyRefreshToken(refreshToken);
  } catch (e) {
    return new Promise(() => {
      throw e instanceof jwt.TokenExpiredError
        ? new TokenExpiredError()
        : new TokenInvalidError();
    });
  }

  return Token.findOne({ tokenId: payload.id })
    .exec()
    .then(token => {
      if (!token) throw new TokenInvalidError();
      return Token.updateTokens(token.userId);
    });
};

const signIn = ({ email, password }) => {
  return User.findOne({ email })
    .exec()
    .then(user => {
      if (!user) throw new UserDoesNotExistError();

      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) throw new InvalidCredentialsError();

      return Token.updateTokens(user._id);
    });
};

module.exports = {
  refreshTokens,
  signIn,
};
