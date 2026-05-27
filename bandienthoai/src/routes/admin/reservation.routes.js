const express = require('express');
const router = express.Router();
const reservationController = require('../../controllers/admin/reservation.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, reservationController.list);
router.post('/:id/status', requireAuth, requireAdmin, reservationController.updateStatus);

module.exports = router;
