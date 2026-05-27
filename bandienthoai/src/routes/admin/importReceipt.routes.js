const express = require('express');
const router = express.Router();
const importReceiptController = require('../../controllers/admin/importReceipt.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, importReceiptController.list);
router.get('/create', requireAuth, requireAdmin, importReceiptController.showCreate);
router.post('/create', requireAuth, requireAdmin, importReceiptController.create);
router.get('/:id', requireAuth, requireAdmin, importReceiptController.detail);
router.post('/delete/:id', requireAuth, requireAdmin, importReceiptController.delete);

module.exports = router;
