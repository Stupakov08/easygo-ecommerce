const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/refresh-tokens', authController.refreshTokens);
router.get('/verifyemail/:token', authController.verifyEmail);

module.exports = router;
