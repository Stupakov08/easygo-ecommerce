const mongoose = require('mongoose');
const { addIdField, makeImageUrls } = require('../helpers/helpers');
const fetch = require('node-fetch');

const categorytSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 64,
    },
  },
  { timestamps: true },
);

categorytSchema.statics = {
  get: function ({ search, count, skip, sort, order }) {
    return Category.find({ title: new RegExp('^' + search, 'i') })
      .sort({ [sort]: order })
      .limit(count)
      .skip(skip)
      .lean()
      .then(async res => {
        res = addIdField(res);
        const total = await Category.countDocuments({
          title: new RegExp('^' + search, 'i'),
        });

        return { data: res, total };
      });
  },
  getCategory: async function ({ id }) {
    let cat = await Category.findById(id);
    return makeImageUrls(addIdField(cat._doc));
  },
};

const Category = mongoose.model('Category', categorytSchema);

module.exports = Category;
