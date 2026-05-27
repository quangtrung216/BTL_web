const express = require('express');
const router = express.Router();
const checkoutController = require('../../controllers/client/checkout.controller');

function requireCheckoutAccess(req, res, next) {
  if (req.session?.user || req.session?.tableOrder) return next();
  return res.redirect('/login');
}

router.get('/', requireCheckoutAccess, checkoutController.index);
router.post('/', requireCheckoutAccess, checkoutController.store);
router.get('/success', requireCheckoutAccess, checkoutController.success);

module.exports = router;
