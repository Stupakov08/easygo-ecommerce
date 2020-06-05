const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const categoriesRouter = require('./categories');
const productRouter = require('./product');
const adminRouter = require('./admin');
const cartRouter = require('./cart');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/admin', adminRouter);

module.exports = router;
