const mongoose = require('mongoose');
const { addIdField, makeImageUrls } = require('../helpers/helpers');
const fetch = require('node-fetch');
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
  get: function ({ search, count, skip, sort, order }) {
    return Product.find({ title: new RegExp('^' + search, 'i') })
      .sort({ [sort]: order })
      .limit(count)
      .skip(skip)
      .lean()
      .then(async res => {
        res = addIdField(res);
        res = makeImageUrls(res);
        const total = await Product.countDocuments({
          title: new RegExp('^' + search, 'i'),
        });

        return { data: res, total };
      });
  },
  getProduct: async function ({ id }) {
    let product = await Product.findById(id);
    return makeImageUrls(addIdField(product._doc));
  },
  add: function ({ title, description, images, price }) {
    const prod = new Product({
      title,
      description,
      images,
      price: parseFloat(price),
    });
    return prod.save();
  },
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
