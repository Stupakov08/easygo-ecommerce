const express = require('express');
const router = express.Router();
const { cartController } = require('../controllers');
// const authAdminMiddleware = require('../middlewares/adminauth');
const authMiddleware = require('../middlewares/adminauth');

// router.get('/', cartController.get);
router.post('/:id', authMiddleware, cartController.updateCart);
router.get('/:id', authMiddleware, cartController.getCart);
// router.delete('/:id', cartController.deleteCart);
// router.put('/:id', cartController.editCart);

module.exports = router;
