const orderService = require('../../services/order.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await orderService.getAllOrders();
      return res.render('admin/orders/list', { title: 'Order - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await orderService.getOrderDetail(req.params.id);
      const orderItems = item ? await orderService.getOrderItemsByOrder(item.id) : [];
      return res.render('admin/orders/detail', { title: 'Order - detail', item, orderItems });
    } catch (error) {
      return next(error);
    }
  }
,

  async updateStatus(req, res, next) {
    try {
      await orderService.updateOrderStatus(req.params.id, req.body.order_status || req.body.status || 'pending');
      return res.redirect('/admin/orders');
    } catch (error) {
      return next(error);
    }
  }
,

  async updatePaymentStatus(req, res, next) {
    try {
      await orderService.updatePaymentStatus(req.params.id, req.body.payment_status || 'unpaid');
      return res.redirect('/admin/orders');
    } catch (error) {
      return next(error);
    }
  }
,

  async cancel(req, res, next) {
    try {
      await orderService.cancelOrderByAdmin(req.params.id);
      return res.redirect('/admin/orders');
    } catch (error) {
      return next(error);
    }
  }


};
