require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const { decodeBase64Image, addIdField } = require('../helpers/helpers');

const Category = require('../models/category');

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
  const existCategory = await Category.findById(id);

  return Category.deleteOne({ _id: id })
    .exec()
    .then(r => {
      if (existCategory && existCategory.image) {
        fs.unlinkSync(
          path.join(__dirname, '/../static/categories/') + existCategory.image,
        );
      }
      return r;
    });
};

const addCategory = async ({ title, images }) => {
  const image = images[0];
  const imgBuffer = decodeBase64Image(image.base);
  const ext = image.rawFile.name.match(/.\w+$/, 'i')[0];
  const name = uid(16) + ext;
  fs.writeFileSync(
    path.join(__dirname, '/../static/categories/') + name,
    imgBuffer.data,
  );

  let category = new Category({
    title,
    image: name,
  });
  return category.save().then(addIdField);
};

const editCategory = async ({ id, title, images }) => {
  const image = images[0];
  const existCategory = await Category.findById(id);

  if (image && image.base) {
    const imgBuffer = decodeBase64Image(image.base);
    const ext = image.rawFile.name.match(/.\w+$/, 'i')[0];
    name = uid(16) + ext;
    fs.writeFileSync(
      path.join(__dirname, '/../static/categories/') + name,
      imgBuffer.data,
    );

    if (existCategory && existCategory.image) {
      fs.unlinkSync(
        path.join(__dirname, '/../static/categories/') + existCategory.image,
      );
    }
  } else {
    name = existCategory.image;
  }

  return Category.updateOne({ _id: id }, { title, image: name }).exec();
};

module.exports = {
  get,
  getCategory,
  deleteCategory,
  addCategory,
  editCategory,
};
