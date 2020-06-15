const express = require('express');
const router = express.Router();
const { chartController } = require('../controllers');
const authMiddleware = require('../middlewares/adminauth');

router.get('/', authMiddleware, chartController.get);

module.exports = router;
