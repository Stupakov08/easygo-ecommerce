require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const { decodeBase64Image, addIdField } = require('../helpers/helpers');

const Category = require('../models/category');

const {} = require('../errors');

const get = async ({ search, count, skip, sort, order }) => {
  let products;
  try {
    count = parseInt(count);
    skip = parseInt(skip);
    products = await Category.get({ search, count, skip, sort, order });
  } catch (e) {
    throw e;
  }
  return addIdField(products);
};
const getCategory = async ({ id }) => {
  let cat;
  cat = await Category.getCategory({ id });
  return addIdField(cat);
};
const deleteCategory = async ({ id }) => {
  return Category.deleteOne({ _id: id }).exec();
};

const addCategory = async ({ title }) => {
  let category = new Category({
    title,
  });
  return category.save().then(addIdField);
};

const editCategory = async ({ id, title }) => {
  return Category.updateOne({ _id: id }, { title }).exec();
};

module.exports = {
  get,
  getCategory,
  deleteCategory,
  addCategory,
  editCategory,
};
