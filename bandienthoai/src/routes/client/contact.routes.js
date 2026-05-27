const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/client/contact.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireCustomer } = require('../../middlewares/role.middleware');

router.get('/', contactController.showForm);
router.post('/', requireAuth, requireCustomer, contactController.submit);

module.exports = router;
