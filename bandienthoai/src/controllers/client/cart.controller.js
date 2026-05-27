const cartService = require('../../services/cart.service');
const promotionService = require('../../services/promotion.service');

module.exports = {
  async index(req, res, next) {
    try {
      const promotionCode = req.session.cartPromotionCode || '';
      const summary = req.session.user
        ? await cartService.calculateCartSummary(req.session.user.id, promotionCode)
        : await cartService.calculateGuestCartSummary(req.session.guestCart, promotionCode);
      if (promotionCode && summary.promotionError) {
        delete req.session.cartPromotionCode;
      }
      if (req.session.cartPromotionMessage) {
        summary.promotionMessage = req.session.cartPromotionMessage;
        delete req.session.cartPromotionMessage;
      }
      if (req.session.cartPromotionError) {
        summary.promotionError = req.session.cartPromotionError;
        delete req.session.cartPromotionError;
      }
      return res.render('client/cart/index', { title: 'Giỏ hàng', pageClass: 'cart-page', items: summary.items, summary });
    } catch (error) { return next(error); }
  },

  async add(req, res, next) {
    try {
      const result = req.session.user
        ? await cartService.addToCart(req.session.user.id, req.body || {})
        : await cartService.addGuestCartItem(req.session, req.body || {});
      if (result && result.ok === false) {
        req.session.appToast = {
          type: 'error',
          title: 'Chưa thêm được món',
          message: result.message || 'Vui lòng thử lại.'
        };
      }
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      if (req.session.user) {
        await cartService.updateCartItem(req.session.user.id, req.params.id, req.body.quantity || 1);
      } else {
        await cartService.updateGuestCartItem(req.session, req.params.id, req.body.quantity || 1);
      }
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async remove(req, res, next) {
    try {
      if (req.session.user) {
        await cartService.removeCartItem(req.session.user.id, req.params.id);
      } else {
        await cartService.removeGuestCartItem(req.session, req.params.id);
      }
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async clear(req, res, next) {
    try {
      if (req.session.user) {
        await cartService.clearCart(req.session.user.id);
      } else {
        await cartService.clearGuestCart(req.session);
      }
      delete req.session.cartPromotionCode;
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async applyPromotion(req, res, next) {
    try {
      const code = String(req.body.promotion_code || '').trim();
      const summary = req.session.user
        ? await cartService.calculateCartSummary(req.session.user.id)
        : await cartService.calculateGuestCartSummary(req.session.guestCart);
      const result = await promotionService.validatePromotionCode(code, summary.totalAmount);

      if (result.ok) {
        req.session.cartPromotionCode = result.code;
        req.session.cartPromotionMessage = result.message;
      } else {
        delete req.session.cartPromotionCode;
        req.session.cartPromotionError = result.message;
      }

      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async removePromotion(req, res, next) {
    try {
      delete req.session.cartPromotionCode;
      delete req.session.cartPromotionMessage;
      delete req.session.cartPromotionError;
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  }
};
