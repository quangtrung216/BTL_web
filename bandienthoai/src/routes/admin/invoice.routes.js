const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/admin/invoice.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, invoiceController.list);
router.get('/:id', requireAuth, requireAdmin, invoiceController.detail);
router.post('/create/:orderId', requireAuth, requireAdmin, invoiceController.create);
router.get('/print/:id', requireAuth, requireAdmin, invoiceController.print);

module.exports = router;
