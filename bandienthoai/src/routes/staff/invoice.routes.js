const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/staff/invoice.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, invoiceController.list);
router.get('/:id', requireAuth, requireAdminOrStaff, invoiceController.detail);
router.post('/create/:orderId', requireAuth, requireAdminOrStaff, invoiceController.create);
router.get('/print/:id', requireAuth, requireAdminOrStaff, invoiceController.print);

module.exports = router;
