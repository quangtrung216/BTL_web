const orderService = require('../../services/order.service');
const reviewService = require('../../services/review.service');

module.exports = {
  async history(req, res, next) {
    try {
      const items = await orderService.getOrdersByUser(req.session.user.id);
      const selectedOrder = items[0] || null;
      const orderItems = selectedOrder ? await orderService.getOrderItemsByOrder(selectedOrder.id) : [];
      const reviews = selectedOrder ? await reviewService.getReviewsByOrder(req.session.user.id, selectedOrder.id) : [];
      return res.render('client/profile/orders', { title: 'Order Tracking', pageClass: 'orders-page-body', items, orderItems, reviews });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await orderService.getOrderDetailByUser(req.session.user.id, req.params.id);
      const items = await orderService.getOrdersByUser(req.session.user.id);
      const orderItems = item ? await orderService.getOrderItemsByOrder(item.id) : [];
      const reviews = item ? await reviewService.getReviewsByOrder(req.session.user.id, item.id) : [];
      return res.render('client/profile/orders', { title: 'Order Detail', pageClass: 'orders-page-body', items, item, orderItems, reviews });
    } catch (error) {
      return next(error);
    }
  }
,

  async cancel(req, res, next) {
    try {
      await orderService.cancelOrderByCustomer(req.session.user.id, req.params.id);
      return res.redirect('/orders');
    } catch (error) {
      return next(error);
    }
  }
,

  async review(req, res, next) {
    try {
      const result = await reviewService.saveOrderItemReview(req.session.user.id, req.params.id, req.body || {});
      req.session.appToast = result.ok
        ? { type: 'success', title: 'Đã gửi đánh giá', message: 'Cảm ơn bạn đã chia sẻ cảm nhận về món.' }
        : { type: 'error', title: 'Không thể đánh giá', message: result.message };
      return res.redirect(`/orders/${req.params.id}`);
    } catch (error) {
      return next(error);
    }
  }


};
