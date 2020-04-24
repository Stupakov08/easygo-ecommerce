const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user');
const Session = require('../models/session');

const {
  TokenInvalidError,
  UserDoesNotExistError,
  InvalidCredentialsError,
  InvalidSessionError,
} = require('../helpers/errors');

const refreshTokens = async (refreshToken, actualFingerprint) => {
  const payload = Session.verifyRefreshToken(refreshToken);

  const session = await Session.findOne({ tokenId: payload.id }).exec();
  if (!session) throw new TokenInvalidError();

  await session.remove();

  if (session.fingerprint != actualFingerprint) throw new InvalidSessionError();

  return Session.addSession(session.userId, actualFingerprint);
};

const signIn = async ({ email, password, fingerprint }) => {
  const user = await User.findOne({ email }).exec();

  if (!user) throw new UserDoesNotExistError();

  const isValid = bcrypt.compareSync(password, user.password);

  if (!isValid) throw new InvalidCredentialsError();

  return Session.addSession(user._id, fingerprint);
};

module.exports = {
  refreshTokens,
  signIn,
};
