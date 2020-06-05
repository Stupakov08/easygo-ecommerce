const mongoose = require('mongoose');
const { addIdField, makeImageUrls } = require('../helpers/helpers');
const fetch = require('node-fetch');

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    cartItems: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
