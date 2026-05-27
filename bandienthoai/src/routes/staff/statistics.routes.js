const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/staff/statistics.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, statisticsController.index);
router.get('/order-status', requireAuth, requireAdminOrStaff, statisticsController.orderStatus);
router.get('/low-stock', requireAuth, requireAdminOrStaff, statisticsController.lowStock);

module.exports = router;
