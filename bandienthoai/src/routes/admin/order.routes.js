const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/order.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, orderController.list);
router.get('/:id', requireAuth, requireAdmin, orderController.detail);
router.post('/:id/status', requireAuth, requireAdmin, orderController.updateStatus);
router.post('/:id/payment-status', requireAuth, requireAdmin, orderController.updatePaymentStatus);
router.post('/:id/cancel', requireAuth, requireAdmin, orderController.cancel);

module.exports = router;
