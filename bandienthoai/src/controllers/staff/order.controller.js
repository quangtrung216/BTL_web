const orderService = require('../../services/order.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await orderService.getAllOrders();
      return res.render('staff/orders/list', { title: 'Order - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await orderService.getOrderDetail(req.params.id);
      return res.render('staff/orders/detail', { title: 'Order - detail', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async updateStatus(req, res, next) {
    try {
      await orderService.updateOrderStatus(req.params.id, req.body.order_status || req.body.status || 'pending');
      return res.redirect('/staff/orders');
    } catch (error) {
      return next(error);
    }
  }
,

  async updatePaymentStatus(req, res, next) {
    try {
      await orderService.updatePaymentStatus(req.params.id, req.body.payment_status || 'unpaid');
      return res.redirect('/staff/orders');
    } catch (error) {
      return next(error);
    }
  }


};
