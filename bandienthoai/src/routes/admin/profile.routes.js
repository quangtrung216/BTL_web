const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profile.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, profileController.index);
router.post('/update', requireAuth, requireAdmin, profileController.update);

module.exports = router;
