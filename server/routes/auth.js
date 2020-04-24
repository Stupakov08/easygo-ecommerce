const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/refresh-tokens', authController.refreshTokens);

module.exports = router;
