const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/admin/statistics.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, statisticsController.index);
router.get('/revenue/day', requireAuth, requireAdmin, statisticsController.revenueByDay);
router.get('/revenue/month', requireAuth, requireAdmin, statisticsController.revenueByMonth);
router.get('/top-selling', requireAuth, requireAdmin, statisticsController.topSelling);
router.get('/low-stock', requireAuth, requireAdmin, statisticsController.lowStock);
router.get('/order-status', requireAuth, requireAdmin, statisticsController.orderStatus);
router.get('/payment-status', requireAuth, requireAdmin, statisticsController.paymentStatus);

module.exports = router;
