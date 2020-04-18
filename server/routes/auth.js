const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.post('/signin', authController.signIn);

module.exports = router;
