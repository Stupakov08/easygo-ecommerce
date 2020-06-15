const authController = require('./auth');
const userController = require('./user');
const productController = require('./product');
const categoryController = require('./category');
const cartController = require('./cart');
const chartController = require('./chart');
const orderController = require('./order');

module.exports = {
  authController,
  userController,
  productController,
  categoryController,
  cartController,
  orderController,
  chartController,
};
