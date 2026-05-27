const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/category.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, categoryController.list);
router.get('/create', requireAuth, requireAdmin, categoryController.showCreate);
router.post('/create', requireAuth, requireAdmin, categoryController.create);
router.get('/edit/:id', requireAuth, requireAdmin, categoryController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, categoryController.update);
router.post('/delete/:id', requireAuth, requireAdmin, categoryController.delete);

module.exports = router;
