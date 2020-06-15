require('dotenv').config();
const orderServices = require('../services/order');
const { returnError, returnBody, returnData } = require('../helpers/helpers');

const makeOrder = async (req, res) => {
  const { id } = req.params;
  const { cartItems, token, amount, currency, address } = req.body;

  orderServices
    .makeOrder({ id, cartItems, token, amount, currency, address })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

const get = async (req, res) => {
  let {
    q = '',
    _start = 0,
    _end = 50,
    _sort = 'updatedAt',
    _order = 'ASC',
  } = req.query;

  orderServices
    .get({
      search: q,
      count: _end,
      skip: _start,
      sort: _sort,
      order: _order,
    })
    .then(returnData(res, req))
    .catch(returnError(res));
};
const getOrder = async (req, res) => {
  let { id } = req.params;

  orderServices
    .getOrder({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const editOrder = async (req, res) => {
  const { id } = req.params;
  const { processed } = req.body;

  orderServices
    .editOrder({ processed, id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const getUserOrders = async (req, res) => {
  const { id } = req.params;
  let {
    q = '',
    _start = 0,
    _end = 50,
    _sort = 'updatedAt',
    _order = 'ASC',
  } = req.query;

  if (res.userId !== id) returnError('Deny');
  orderServices
    .getUserOrders({
      id,
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
  makeOrder,
  get,
  getOrder,
  editOrder,
  getUserOrders,
};
