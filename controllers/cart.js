require('dotenv').config();
const cartServices = require('../services/cart');
const { returnError, returnBody, returnData } = require('../helpers/helpers');

const getCart = async (req, res) => {
  let { id } = req.params;

  cartServices
    .getCart({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

const updateCart = async (req, res) => {
  const { id } = req.params;
  const { cartItems } = req.body;

  cartServices
    .updateCart({ id, cartItems })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

module.exports = {
  updateCart,
  getCart,
};
