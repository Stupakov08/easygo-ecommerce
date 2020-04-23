const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models').User;
const Token = require('../models').Token;
const {
  TokenInvalidError,
  UserDoesNotExistError,
  InvalidCredentialsError,
  InvalidSessionError,
} = require('../helpers/errors');

const refreshTokens = async (refreshToken, actualFingerprint) => {
  const payload = Token.verifyRefreshToken(refreshToken);

  const session = await Token.findOne({ tokenId: payload.id }).exec();
  if (!session) throw new TokenInvalidError();

  await session.remove();

  if (session.fingerprint != actualFingerprint) throw new InvalidSessionError();

  return Token.addSession(session.userId, actualFingerprint);
};

const signIn = async ({ email, password, fingerprint }) => {
  const user = await User.findOne({ email }).exec();

  if (!user) throw new UserDoesNotExistError();

  const isValid = bcrypt.compareSync(password, user.password);

  if (!isValid) throw new InvalidCredentialsError();

  return Token.addSession(user._id, fingerprint);
};

module.exports = {
  refreshTokens,
  signIn,
};
