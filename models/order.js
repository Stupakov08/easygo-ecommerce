const mongoose = require('mongoose');
const {
  addIdField,
  makeImageUrls,
  productIdtoLine,
} = require('../helpers/helpers');
const fetch = require('node-fetch');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: function () {
        return Math.random().toString().substring(2, 8);
      },
    },
    address: {
      name: { type: String },
      country: { type: String },
      city: { type: String },
      address: { type: String },
      zip: { type: String },
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    cartItems: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
      },
    ],
    payment: {},
    processed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
orderSchema.statics = {
  getForUser: function ({ search, count, skip, sort, order, id }) {
    return Order.find({ orderId: new RegExp('^' + search, 'i') })
      .where({ userId: id })
      .populate('userId')
      .populate('cartItems.productId')
      .sort({ [sort]: order })
      .limit(count - skip)
      .skip(skip)
      .lean()
      .then(async res => {
        res = addIdField(res);
        // res = makeImageUrls(res);
        const total = await Order.find({
          orderId: new RegExp('^' + search, 'i'),
        })
          .where({ userId: id })
          .countDocuments();

        return { data: res, total };
      });
  },
  get: function ({ search, count, skip, sort, order }) {
    return Order.find({ orderId: new RegExp('^' + search, 'i') })
      .populate('userId')
      .populate('cartItems.productId')
      .sort({ [sort]: order })
      .limit(count - skip)
      .skip(skip)
      .lean()
      .then(async res => {
        res = addIdField(res);
        // res = makeImageUrls(res);
        const total = await Order.countDocuments();

        return { data: res, total };
      });
  },
  getOrder: async function ({ id }) {
    let order = await Order.findById(id)
      .populate('userId')
      .populate('cartItems.productId');
    order = {
      ...order._doc,
      cartItems: productIdtoLine(
        order._doc.cartItems.map(item => {
          return {
            productId: makeImageUrls(addIdField(item.productId._doc)),
            quantity: item._doc.quantity,
          };
        }),
      ),
    };
    return addIdField(order);
  },
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
