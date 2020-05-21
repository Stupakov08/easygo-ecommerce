const express = require('express');
const router = express.Router();
const { productController } = require('../controllers');
const authMiddleware = require('../middlewares/adminauth');

router.get('/', productController.get);
router.get('/:id', productController.getProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
router.put('/:id', authMiddleware, productController.editProduct);
router.post('/', authMiddleware, productController.addProduct);

module.exports = router;
