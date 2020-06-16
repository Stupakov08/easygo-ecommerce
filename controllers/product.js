require('dotenv').config();
const productServices = require('../services/product');
const { returnError, returnBody, returnData } = require('../helpers/helpers');

const get = async (req, res) => {
  let {
    q = '',
    c = '',
    _start = 0,
    _end = 50,
    _sort = 'updatedAt',
    _order = 'ASC',
  } = req.query;

  productServices
    .get({
      search: q,
      count: _end,
      skip: _start,
      sort: _sort,
      order: _order,
      category: c,
    })
    .then(returnData(res, req))
    .catch(returnError(res));
};
const getProduct = async (req, res) => {
  let { id } = req.params;

  productServices
    .getProduct({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const deleteProduct = async (req, res) => {
  let { id } = req.params;

  productServices
    .deleteProduct({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const addProduct = async (req, res) => {
  let { description, title, price, images, code, categories } = req.body;

  productServices
    .addProduct({ description, title, price, images, code, categories })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, images, categories } = req.body;

  productServices
    .editProduct({ id, title, description, price, images, categories })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

module.exports = {
  get,
  getProduct,
  deleteProduct,
  addProduct,
  editProduct,
};
