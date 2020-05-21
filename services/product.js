require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const { decodeBase64Image } = require('../helpers/helpers');

const Product = require('../models/product');

const {} = require('../errors');

const get = async ({ search, count, skip, sort, order }) => {
  let products;
  try {
    count = parseInt(count);
    skip = parseInt(skip);
    products = await Product.get({ search, count, skip, sort, order });
  } catch (e) {
    throw e;
  }
  return products;
};
const getProduct = async ({ id }) => {
  let product;
  product = await Product.getProduct({ id });
  return product;
};
const deleteProduct = async ({ id }) => {
  return Product.deleteOne({ _id: id }).exec();
};
const addProduct = async ({ title, description, images, price, code }) => {
  const imgUrls = images
    ? images.map(img => {
        const imgBuffer = decodeBase64Image(img.base);
        const ext = img.rawFile.name.match(/.\w+$/, 'i')[0];
        const name = uid(16) + ext;
        fs.writeFileSync(
          path.join(__dirname, '/../static/products/') + name,
          imgBuffer.data,
        );
        return { url: name };
      })
    : undefined;

  let product = new Product({
    title,
    description,
    price,
    code,
    images: imgUrls,
  });
  return product.save();
};
const editProduct = async ({ id, title, description, images, price }) => {
  const imgUrls = images
    ? images.map(img => {
        if (!img.rawFile) return { url: img._doc.url };
        const imgBuffer = decodeBase64Image(img.base);
        const ext = img.rawFile.name.match(/.\w+$/, 'i')[0];
        const name = uid(16) + ext;
        fs.writeFileSync(
          path.join(__dirname, '/../static/products/') + name,
          imgBuffer.data,
        );
        return { url: name };
      })
    : undefined;
  return Product.updateOne(
    { _id: id },
    { title, description, price: parseFloat(price), images: imgUrls },
  ).exec();
};

module.exports = {
  get,
  getProduct,
  deleteProduct,
  addProduct,
  editProduct,
};
