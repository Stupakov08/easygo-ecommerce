const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const {
  userSignupValidator,
  userSignInValidator,
  refreshTokensValidator,
} = require('../validators/auth');
const { runValidation } = require('../validators');

router.post(
  '/signup',
  userSignupValidator,
  runValidation,
  authController.signUp,
);
router.post(
  '/signin',
  userSignInValidator,
  runValidation,
  authController.signIn,
);
router.post(
  '/refresh-tokens',
  refreshTokensValidator,
  runValidation,
  authController.refreshTokens,
);
router.get('/verifyemail/:token', authController.verifyEmail);

module.exports = router;
