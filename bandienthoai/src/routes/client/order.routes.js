const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/order.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

router.get('/', requireAuth, orderController.history);
router.get('/:id', requireAuth, orderController.detail);
router.post('/:id/cancel', requireAuth, orderController.cancel);
router.post('/:id/reviews', requireAuth, orderController.review);

module.exports = router;
