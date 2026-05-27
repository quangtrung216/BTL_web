const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/client/promotion.controller');

router.get('/', promotionController.index);
router.get('/:id', promotionController.detail);

module.exports = router;
