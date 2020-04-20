class UserDoesNotExistError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'UserDoesNotExistError';
    this.status = '404';
    this.message = 'User DoesNot Exist! ' + msg;
  }
}
module.exports = {
  UserDoesNotExistError,
};
