const checkoutService = require('../../services/checkout.service');
const realtimeService = require('../../services/realtime.service');
const userService = require('../../services/user.service');

module.exports = {
  async index(req, res, next) {
    try {
      const summary = await checkoutService.prepareCheckout(req.session.user?.id || null, {
        tableOrder: req.session.tableOrder,
        guestCart: req.session.guestCart,
        promotionCode: req.session.tableOrder ? '' : req.session.cartPromotionCode
      });
      return res.render('client/checkout/index', { title: 'Thanh toán', summary });
    } catch (error) { return next(error); }
  },

  async store(req, res, next) {
    try {
      const userId = req.session.user?.id || null;
      const result = await checkoutService.createOrderFromCart(userId, req.body || {}, {
        tableOrder: req.session.tableOrder,
        guestCart: req.session.guestCart
      });
      if (!result.ok) {
        return res.render('client/checkout/index', {
          title: 'Thanh toán',
          error: result.message,
          summary: await checkoutService.prepareCheckout(userId, {
            tableOrder: req.session.tableOrder,
            guestCart: req.session.guestCart,
            promotionCode: req.session.tableOrder ? '' : req.session.cartPromotionCode
          })
        });
      }
      delete req.session.cartPromotionCode;
      delete req.session.cartPromotionMessage;
      delete req.session.cartPromotionError;
      if (req.session.tableOrder) {
        realtimeService.publishTableOrderCreated({
          orderId: result.orderId,
          table: req.session.tableOrder
        });
        req.session.guestCart = [];
        req.session.appToast = {
          type: 'success',
          title: 'Đã gửi đơn tới quầy',
          message: `${req.session.tableOrder.label || 'Bàn của bạn'} đã gửi đơn thành công. Nhân viên sẽ sớm phục vụ.`
        };
        return res.redirect('/products');
      }

      if (req.body?.save_address === '1' && req.session.user) {
        const currentProfile = await userService.getUserById(req.session.user.id);
        const profileData = {
          full_name: currentProfile?.full_name || req.session.user.full_name || '',
          phone: req.body.receiver_phone || '',
          address: req.body.shipping_address
            || [req.body.shipping_ward, req.body.shipping_province].filter(Boolean).join(' - ')
            || req.body.receiver_address
            || ''
        };
        await userService.updateProfile(req.session.user.id, profileData);
        req.session.user = {
          ...req.session.user,
          phone: profileData.phone,
          address: profileData.address
        };
      }
      req.session.appToast = {
        type: 'success',
        title: 'Đặt hàng thành công',
        message: 'Đơn hàng của bạn đã được ghi nhận. Brew Haven sẽ sớm xử lý đơn hàng.'
      };
      return res.redirect(`/orders/${result.orderId}`);
    } catch (error) { return next(error); }
  },

  async success(req, res, next) {
    try {
      return res.redirect('/orders');
    } catch (error) { return next(error); }
  }
};
