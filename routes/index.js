const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const categoriesRouter = require('./categories');
const productRouter = require('./product');
const adminRouter = require('./admin');
const cartRouter = require('./cart');
const chartRouter = require('./chart');
const orderRouter = require('./order');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/chart', chartRouter);
router.use('/orders', orderRouter);
router.use('/admin', adminRouter);

module.exports = router;
