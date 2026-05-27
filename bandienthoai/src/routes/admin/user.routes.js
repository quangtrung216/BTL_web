const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, userController.list);
router.get('/create', requireAuth, requireAdmin, userController.showCreate);
router.post('/create-staff', requireAuth, requireAdmin, userController.createStaff);
router.post('/create-admin', requireAuth, requireAdmin, userController.createAdmin);
router.get('/edit/:id', requireAuth, requireAdmin, userController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, userController.update);
router.post('/toggle-status/:id', requireAuth, requireAdmin, userController.toggleStatus);
router.post('/change-role/:id', requireAuth, requireAdmin, userController.changeRole);
router.get('/:id', requireAuth, requireAdmin, userController.detail);

module.exports = router;
