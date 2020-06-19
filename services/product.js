require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const { decodeBase64Image, addIdField } = require('../helpers/helpers');

const Product = require('../models/product');
const Category = require('../models/category');

const get = async ({ search, count, skip, sort, order, category }) => {
  let products;
  try {
    count = parseInt(count);
    skip = parseInt(skip);
    products = await Product.get({
      search,
      category,
      count,
      skip,
      sort,
      order,
    });
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
  const existProduct = await Product.findById(id);

  return Product.deleteOne({ _id: id })
    .exec()
    .then(r => {
      if (existProduct && existProduct.images.length > 0) {
        existProduct.images.map(i => {
          fs.unlinkSync(path.join(__dirname, '/../static/products/') + i.url);
        });
      }
      return r;
    });
};
const getCategories = async categories => {
  return Promise.all(
    categories.map(async id => {
      const cat = await Category.find({ _id: id }).exec();

      return cat[0];
    }),
  );
};
const addProduct = async ({
  title,
  description,
  images,
  price,
  code,
  categories,
}) => {
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

  categories = await getCategories(categories);

  let product = new Product({
    title,
    description,
    price,
    code,
    images: imgUrls,
    categories,
  });
  let prod = await product.save();

  return prod
    .populate('categories')
    .execPopulate()
    .then(p => {
      return p.toObject();
    })
    .then(addIdField);
};
const editProduct = async ({
  id,
  title,
  description,
  images,
  price,
  categories,
}) => {
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

  categories = await getCategories(categories);
  const updated = Product.updateOne(
    { _id: id },
    {
      title,
      description,
      price: parseFloat(price),
      images: imgUrls,
      categories,
    },
  ).exec();
  return updated;
};

module.exports = {
  get,
  getProduct,
  deleteProduct,
  addProduct,
  editProduct,
};
