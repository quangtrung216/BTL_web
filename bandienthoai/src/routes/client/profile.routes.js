const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/client/profile.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

router.get('/', requireAuth, profileController.index);
router.post('/update', requireAuth, profileController.updateProfile);

module.exports = router;
