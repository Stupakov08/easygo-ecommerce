const express = require('express');
const router = express.Router();
const { authController } = require('../../controllers/admin');

router.post('/signin', authController.signIn);
router.get('/adminsexist', authController.adminsExist);

module.exports = router;
