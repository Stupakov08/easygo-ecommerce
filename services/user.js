require('dotenv').config();
const config = require('../config/app').auth;

const User = require('../models/user');

const {
  TokenInvalidError,
  UserDoesNotExistError,
  InvalidCredentialsError,
  InvalidSessionError,
  EmailIsAlreadyTakenError,
  PasswordsDoNotMatch,
} = require('../errors');

const get = async ({ userId }) => {
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

module.exports = {
  get,
};
