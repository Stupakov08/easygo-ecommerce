const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');

router.get('/get', userController.get);

module.exports = router;
