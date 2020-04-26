const { check } = require('express-validator');

exports.userSignupValidator = [
  check('name', 'Name is empty').not().isEmpty(),
  check('email', 'Invalid email').isEmail(),
  check('password', 'Invalid password').isLength({ min: 6 }),
  check(
    'passwordconf',
    'passwordConfirmation field must have the same value as the password field',
  )
    .exists()
    .custom((value, { req }) => value === req.body.password),
  check('fingerprint', 'fingerprint is empty').not().isEmpty(),
];

exports.userSignInValidator = [
  check('email', 'Invalid email').isEmail(),
  check('password', 'Invalid password').isLength({ min: 6 }),
  check('fingerprint', 'fingerprint is empty').not().isEmpty(),
];

exports.refreshTokensValidator = [
  check('fingerprint', 'fingerprint is empty').not().isEmpty(),
];
