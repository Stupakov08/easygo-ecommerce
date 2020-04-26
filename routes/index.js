const express = require('express');
const router = express.Router();
const authRouer = require('./auth');

router.use('/auth', authRouer);

module.exports = router;
