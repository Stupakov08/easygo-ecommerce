const express = require('express');
const router = express.Router();
const { categoryController } = require('../controllers');
const authMiddleware = require('../middlewares/adminauth');

router.get('/', categoryController.get);
router.post('/', authMiddleware, categoryController.addCategory);
router.get('/:id', categoryController.getCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);
router.put('/:id', authMiddleware, categoryController.editCategory);

module.exports = router;
