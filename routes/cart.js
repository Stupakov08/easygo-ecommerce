const express = require('express');
const router = express.Router();
const { cartController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');

router.post('/:id', authMiddleware, cartController.updateCart);
router.get('/:id', authMiddleware, cartController.getCart);

module.exports = router;
