require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const {
  decodeBase64Image,
  addIdField,
  productIdtoLine,
  makeImageUrls,
} = require('../helpers/helpers');

const Cart = require('../models/cart');

const updateCart = async ({ id, cartItems }) => {
  cartItems =
    cartItems &&
    cartItems.map(item => ({
      productId: item.line._id,
      quantity: item.quantity,
    }));
  let response;
  const cart = await Cart.findOne({ userId: id }).exec();
  if (cart) {
    if (cartItems.length > 0) {
      cart.cartItems = cartItems;
      response = await cart.save();
    } else {
      response = await cart.remove();
      return { cartItems: [] };
    }
  } else {
    response = await new Cart({
      cartItems,
      userId: id,
    }).save();
  }
  return response
    .populate('cartItems.productId')
    .execPopulate()
    .then(p => {
      const res = p.toObject();
      return {
        ...res,
        cartItems: productIdtoLine(
          res.cartItems.map(item => {
            return {
              productId: makeImageUrls(addIdField(item.productId)),
              quantity: item.quantity,
            };
          }),
        ),
      };
    });
};
const getCart = async ({ id }) => {
  const cart = await Cart.findOne({ userId: id }).exec();
  // if (cart) return { cartItems: [] };
  return cart == null
    ? { cartItems: null }
    : cart
        .populate('cartItems.productId')
        .execPopulate()
        .then(p => {
          const res = p.toObject();
          return {
            ...res,
            cartItems: productIdtoLine(
              res.cartItems.map(item => {
                return {
                  productId: makeImageUrls(addIdField(item.productId)),
                  quantity: item.quantity,
                };
              }),
            ),
          };
        });
};

module.exports = {
  updateCart,
  getCart,
};
