require('dotenv').config();
const categoryServices = require('../services/category');
const { returnError, returnBody, returnData } = require('../helpers/helpers');

const get = async (req, res) => {
  let {
    q = '',
    _start = 0,
    _end = 50,
    _sort = 'updatedAt',
    _order = 'DESC',
  } = req.query;

  categoryServices
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
const addCategory = async (req, res) => {
  let { title } = req.body;

  categoryServices
    .addCategory({ title })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const getCategory = async (req, res) => {
  let { id } = req.params;

  categoryServices
    .getCategory({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};
const deleteCategory = async (req, res) => {
  let { id } = req.params;

  categoryServices
    .deleteCategory({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

const editCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  categoryServices
    .editCategory({ id, title })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

module.exports = {
  get,
  getCategory,
  deleteCategory,
  addCategory,
  editCategory,
};
