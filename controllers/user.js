require('dotenv').config();
const userServices = require('../services/auth');
const { returnError, returnAuthTokens } = require('../helpers/helpers');

const get = async (req, res) => {
  const { userId } = req.body;

  userServices
    .get({ userId })
    .then(returnAuthTokens(res, req))
    .catch(returnError(res));
};

module.exports = {
  get,
};
