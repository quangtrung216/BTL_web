const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/admin/brand.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, brandController.list);
router.get('/create', requireAuth, requireAdmin, brandController.showCreate);
router.post('/create', requireAuth, requireAdmin, brandController.create);
router.get('/edit/:id', requireAuth, requireAdmin, brandController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, brandController.update);
router.post('/delete/:id', requireAuth, requireAdmin, brandController.delete);

module.exports = router;
