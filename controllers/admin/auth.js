require('dotenv').config();
const authServices = require('../../services/admin/auth');
const {
  returnError,
  returnAuthTokens,
  returnBody,
} = require('../../helpers/helpers');

const signIn = (req, res) => {
  const { email, password, passwordconf, fingerprint } = req.body;

  authServices
    .signIn({ email, password, passwordconf, fingerprint })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

const adminsExist = (req, res) => {
  authServices.adminsExist().then(returnBody(res, req)).catch(returnError(res));
};

module.exports = {
  signIn,
  adminsExist,
};
