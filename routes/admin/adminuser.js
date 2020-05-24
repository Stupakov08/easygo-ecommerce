const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/user');
const authMiddleware = require('../../middlewares/adminauth');
const permissionMiddleware = require('../../middlewares/adminpermission');

router.get('/', authMiddleware, adminUserController.get);
router.post('/', authMiddleware, permissionMiddleware, adminUserController.add);
router.get('/:id', authMiddleware, adminUserController.getUser);
router.put('/:id', authMiddleware, adminUserController.editUser);

module.exports = router;
