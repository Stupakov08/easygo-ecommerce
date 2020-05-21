require('dotenv').config();
const AdminUser = require('../../models/admin/user');
const AdminSession = require('../../models/admin/session');

const {
  TokenInvalidError,
  UserDoesNotExistError,
  InvalidCredentialsError,
  InvalidSessionError,
  EmailIsAlreadyTakenError,
  PasswordsDoNotMatch,
} = require('../../errors');

const signIn = async ({ email, password, passwordconf, fingerprint }) => {
  const exist = await adminsExist();
  let user;

  if (exist.exist) {
    user = await AdminUser.findOne({ email }).exec();
    if (!user) throw new UserDoesNotExistError();
    const isValid = user.comparePassword(password);
    if (!isValid) throw new InvalidCredentialsError();
  } else {
    if (password != passwordconf) throw new PasswordsDoNotMatch();
    user = await new AdminUser({
      email,
      password,
    }).save();
  }

  return AdminSession.addSession(user, fingerprint);
};

const adminsExist = async () => {
  const count = await AdminUser.countDocuments();
  return { exist: count > 0 };
};

module.exports = {
  signIn,
  adminsExist,
};
