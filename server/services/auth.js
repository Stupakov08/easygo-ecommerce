require('dotenv').config();

const User = require('../models/user');
const Session = require('../models/session');

const {
  TokenInvalidError,
  UserDoesNotExistError,
  InvalidCredentialsError,
  InvalidSessionError,
  EmailIsAlreadyTakenError,
  PasswordsDoNotMatch,
} = require('../errors');

const signUp = async ({ name, email, password, passwordconf, fingerprint }) => {
  const user = await User.findOne({ email }).exec();

  if (user) throw new EmailIsAlreadyTakenError();
  if (password != passwordconf) throw new PasswordsDoNotMatch();

  const newUser = await new User({
    name,
    email,
    password,
  }).save();

  return Session.addSession(newUser._id, fingerprint);
};

const signIn = async ({ email, password, fingerprint }) => {
  const user = await User.findOne({ email }).exec();

  if (!user) throw new UserDoesNotExistError();
  console.log('ppp', password, user.password);
  const isValid = user.comparePassword(password);

  if (!isValid) throw new InvalidCredentialsError();

  return Session.addSession(user._id, fingerprint);
};

const refreshTokens = async (refreshToken, actualFingerprint) => {
  const payload = Session.verifyRefreshToken(refreshToken);

  const session = await Session.findOne({ tokenId: payload.id }).exec();
  if (!session) throw new TokenInvalidError();

  await session.remove();

  if (session.fingerprint != actualFingerprint) throw new InvalidSessionError();

  return Session.addSession(session.userId, actualFingerprint);
};

module.exports = {
  signUp,
  signIn,
  refreshTokens,
};
