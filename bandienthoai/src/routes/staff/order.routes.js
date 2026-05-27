const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/staff/order.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, orderController.list);
router.get('/:id', requireAuth, requireAdminOrStaff, orderController.detail);
router.post('/:id/status', requireAuth, requireAdminOrStaff, orderController.updateStatus);
router.post('/:id/payment-status', requireAuth, requireAdminOrStaff, orderController.updatePaymentStatus);

module.exports = router;
