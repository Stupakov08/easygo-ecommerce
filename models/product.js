const mongoose = require('mongoose');
const { addIdField, makeImageUrls } = require('../helpers/helpers');
const fetch = require('node-fetch');
const Category = require('./category');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 64,
    },
    code: {
      type: String,
      trim: true,
      required: true,
      maxlength: 16,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
    images: {
      type: [
        {
          url: {
            type: String,
            trim: true,
          },
        },
      ],
    },
  },
  { timestamps: true },
);

productSchema.statics = {
  get: async function ({ search, count, skip, sort, order, category }) {
    const cat = await Category.find({ title: category }).exec();
    const catquery =
      category && cat.length != 0
        ? { categories: mongoose.Types.ObjectId(cat[0]._id) }
        : {};

    return Product.find({ title: new RegExp('^' + search, 'i'), ...catquery })
      .populate('categories')
      .sort({ [sort]: order })
      .limit(count - skip)
      .skip(skip)
      .lean()
      .then(async res => {
        res = addIdField(res);
        res = makeImageUrls(res);
        const total = await Product.countDocuments({
          title: new RegExp('^' + search, 'i'),
          ...catquery,
        });

        return { data: res, total };
      });
  },
  getProduct: async function ({ id }) {
    let product = await Product.findById(id).populate('categories');
    return makeImageUrls(addIdField(product._doc));
  },
  add: function ({ title, description, images, price, categories }) {
    const prod = new Product({
      title,
      description,
      images,
      categories,
      price: parseFloat(price),
    });
    return prod.save();
  },
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
