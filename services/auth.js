require('dotenv').config();
const config = require('../config/app').auth;

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
    verified: config.emailConfirmation ? false : true,
  }).save();

  config.emailConfirmation && newUser.sendVerificationEmail();

  return Session.addSession(newUser, fingerprint);
};

const signIn = async ({ email, password, fingerprint }) => {
  const user = await User.findOne({ email }).exec();

  if (!user) throw new UserDoesNotExistError();

  const isValid = user.comparePassword(password);

  if (!isValid) throw new InvalidCredentialsError();

  return Session.addSession(user, fingerprint);
};

const refreshTokens = async (refreshToken, actualFingerprint) => {
  const payload = Session.verifyRefreshToken(refreshToken);

  const session = await Session.findOne({ tokenId: payload.id }).exec();
  if (!session) throw new TokenInvalidError();

  await session.remove();

  if (session.fingerprint != actualFingerprint) throw new InvalidSessionError();

  const user = await User.findById(session.userId);

  return Session.addSession(user._id, actualFingerprint);
};

const signOut = async refreshToken => {
  const payload = Session.verifyRefreshToken(refreshToken);

  const session = await Session.findOne({ tokenId: payload.id }).exec();
  if (!session) throw new TokenInvalidError();

  return session.remove();
};

const verifyEmail = async token => {
  const payload = User.verifyVerificationEmailToken(token);

  return User.verifyUser(payload.userId);
};
const updateUser = async ({ id, name }) => {
  const user = await User.findById(id).exec();
  user.name = name;
  return user.save();
};

module.exports = {
  signUp,
  signIn,
  signOut,
  refreshTokens,
  verifyEmail,
  updateUser,
};
