require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const { decodeBase64Image, addIdField } = require('../../helpers/helpers');

const AdminUser = require('../../models/admin/user');

const get = async ({ search, count, skip, sort, order }) => {
  let products;
  try {
    count = parseInt(count);
    skip = parseInt(skip);
    products = await AdminUser.get({ search, count, skip, sort, order });
  } catch (e) {
    throw e;
  }
  return products;
};

const addUser = async ({ email, password, passwordconf, superadmin }) => {
  const user = await AdminUser.findOne({ email }).exec();

  if (user) throw new EmailIsAlreadyTakenError();
  if (password != passwordconf) throw new PasswordsDoNotMatch();

  const newUser = await new AdminUser({
    email,
    password,
    superadmin,
  }).save();

  return addIdField(newUser);
};

const getUser = async ({ id }) => {
  let product;
  product = await AdminUser.getUser({ id });
  return product;
};

const editUser = async ({ id, email, password, passwordconf, superadmin }) => {
  const user = await AdminUser.findOne({ _id: id }).exec();

  if (!user) throw new Error('Email doesnot exist');
  if (password != passwordconf) throw new PasswordsDoNotMatch();

  return AdminUser.findById(id, function (err, doc) {
    if (err != null || doc == null) throw new Error('Email doesnot exist');
    doc.password = password;
    doc.superadmin = superadmin;
    doc.email = email;
    doc.save();
  });
};
const deleteUser = async ({ id }) => {
  return AdminUser.deleteOne({ _id: id }).exec();
};

module.exports = {
  get,
  addUser,
  getUser,
  editUser,
  deleteUser,
};
