const express = require('express');
const router = express.Router();
const tableController = require('../../controllers/client/table.controller');

router.get('/table/:tableCode', tableController.start);
router.post('/table/clear', tableController.clear);

module.exports = router;
