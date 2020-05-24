const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');

router.get('/', userController.getList);
router.get('/get', userController.get);

module.exports = router;
