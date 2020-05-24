require('dotenv').config();
const authServices = require('../services/auth');
const userServices = require('../services/user');
const {
  returnError,
  returnData,
  returnAuthTokens,
} = require('../helpers/helpers');

const get = async (req, res) => {
  const { userId } = req.body;

  authServices
    .get({ userId })
    .then(returnAuthTokens(res, req))
    .catch(returnError(res));
};

const getList = async (req, res) => {
  let {
    q = '',
    _start = 0,
    _end = 50,
    _sort = 'updatedAt',
    _order = 'ASC',
  } = req.query;

  userServices
    .getList({
      search: q,
      count: _end,
      skip: _start,
      sort: _sort,
      order: _order,
    })
    .then(returnData(res, req))
    .catch(returnError(res));
};

module.exports = {
  get,
  getList,
};
