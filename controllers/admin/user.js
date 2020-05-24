require('dotenv').config();
const adminUserServices = require('../../services/admin/user');
const {
  returnError,
  returnBody,
  returnData,
} = require('../../helpers/helpers');

const get = async (req, res) => {
  let {
    q = '',
    _start = 0,
    _end = 50,
    _sort = 'updatedAt',
    _order = 'ASC',
  } = req.query;

  adminUserServices
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
const add = async (req, res) => {
  let { email, password, passwordconf, superadmin } = req.body;

  adminUserServices
    .addUser({ email, password, passwordconf, superadmin })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

const getUser = async (req, res) => {
  let { id } = req.params;

  adminUserServices
    .getUser({ id })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, passwordconf, superadmin } = req.body;

  adminUserServices
    .editUser({ id, email, password, passwordconf, superadmin })
    .then(returnBody(res, req))
    .catch(returnError(res));
};

module.exports = {
  get,
  add,
  getUser,
  editUser,
};
