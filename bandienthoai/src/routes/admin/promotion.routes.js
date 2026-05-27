const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/admin/promotion.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, promotionController.list);
router.get('/create', requireAuth, requireAdmin, promotionController.showCreate);
router.post('/create', requireAuth, requireAdmin, promotionController.create);
router.get('/edit/:id', requireAuth, requireAdmin, promotionController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, promotionController.update);
router.post('/delete/:id', requireAuth, requireAdmin, promotionController.delete);
router.post('/:id/assign-products', requireAuth, requireAdmin, promotionController.assignProducts);
router.post('/:id/remove-product/:productId', requireAuth, requireAdmin, promotionController.removeProduct);

module.exports = router;
