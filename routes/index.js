const express = require('express');
const router = express.Router();
const authRouer = require('./auth');
const userRouer = require('./user');

router.use('/auth', authRouer);
router.use('/user', userRouer);

module.exports = router;
