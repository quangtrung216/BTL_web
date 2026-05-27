const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller');

function requireCartAccess(req, res, next) {
  if (req.session?.user || req.session?.tableOrder) return next();
  return res.redirect('/login');
}

router.get('/', requireCartAccess, cartController.index);
router.post('/add', requireCartAccess, cartController.add);
router.post('/update/:id', requireCartAccess, cartController.update);
router.post('/remove/:id', requireCartAccess, cartController.remove);
router.post('/clear', requireCartAccess, cartController.clear);
router.post('/promotion/apply', requireCartAccess, cartController.applyPromotion);
router.post('/promotion/remove', requireCartAccess, cartController.removePromotion);

module.exports = router;
