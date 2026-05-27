const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/staff/dashboard.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, dashboardController.index);

module.exports = router;
