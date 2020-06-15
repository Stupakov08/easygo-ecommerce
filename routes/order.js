const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');
const adminAuthMiddleware = require('../middlewares/adminauth');
const authMiddleware = require('../middlewares/auth');

router.get('/', adminAuthMiddleware, orderController.get);
router.get('/:id', adminAuthMiddleware, orderController.getOrder);
router.put('/:id', adminAuthMiddleware, orderController.editOrder);
router.post('/:id', authMiddleware, orderController.makeOrder);
router.get('/user/:id', authMiddleware, orderController.getUserOrders);
router.get('/details/:id', authMiddleware, orderController.getOrder);

module.exports = router;
