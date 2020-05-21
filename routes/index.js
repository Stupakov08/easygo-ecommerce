const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const productRouter = require('./product');
const adminRouter = require('./admin');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/admin', adminRouter);

module.exports = router;
