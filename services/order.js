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

const Order = require('../models/order');
const Cart = require('../models/cart');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const makeOrder = async ({
  id,
  cartItems,
  token,
  amount,
  currency,
  address,
}) => {
  cartItems =
    cartItems &&
    cartItems.map(item => ({
      productId: item.line._id,
      quantity: item.quantity,
    }));

  const body = {
    source: token.id,
    amount: amount,
    currency,
  };
  return stripe.charges.create(body).then(data => {
    if (!data) {
      throw new Error(stripeErr);
    }
    const order = new Order({
      userId: id,
      cartItems,
      payment: data,
      address,
    });
    return order.save().then(r => {
      return Cart.find({ userId: r.userId })
        .remove()
        .exec()
        .then(b => {
          return r;
        });
    });
  });
};
const get = async ({ search, count, skip, sort, order }) => {
  let orders;
  try {
    count = parseInt(count);
    skip = parseInt(skip);
    orders = await Order.get({ search, count, skip, sort, order });
  } catch (e) {
    throw e;
  }
  return orders;
};
const getOrder = async ({ id }) => {
  let order;
  order = await Order.getOrder({ id });
  return order;
};

const editOrder = async ({ processed, id }) => {
  return Order.updateOne(
    { _id: id },
    {
      processed,
    },
  ).exec();
};

const getUserOrders = async ({ search, count, skip, sort, order, id }) => {
  let orders;
  try {
    count = parseInt(count);
    skip = parseInt(skip);
    orders = await Order.getForUser({ search, count, skip, sort, order, id });
  } catch (e) {
    throw e;
  }
  return orders;
};

module.exports = {
  makeOrder,
  get,
  getOrder,
  editOrder,
  getUserOrders,
};
