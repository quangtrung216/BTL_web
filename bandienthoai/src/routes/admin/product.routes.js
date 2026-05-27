const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, productController.list);
router.get('/create', requireAuth, requireAdmin, productController.showCreate);
router.post('/create', requireAuth, requireAdmin, productController.create);
router.get('/edit/:id', requireAuth, requireAdmin, productController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, productController.update);
router.post('/delete/:id', requireAuth, requireAdmin, productController.delete);
router.post('/toggle-status/:id', requireAuth, requireAdmin, productController.toggleStatus);

module.exports = router;
