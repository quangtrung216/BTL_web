const invoiceService = require('../../services/invoice.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await invoiceService.getAllInvoices();
      return res.render('staff/invoices/list', { title: 'Invoice - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await invoiceService.detail(req.params.id);
      return res.render('staff/invoices/detail', { title: 'Invoice - detail', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await invoiceService.createInvoice(req.params.orderId, req.session.user.id);
      return res.redirect('/staff/invoices');
    } catch (error) {
      return next(error);
    }
  }
,

  async print(req, res, next) {
    try {
      const item = await invoiceService.getInvoiceById(req.params.id);
      return res.render('staff/invoices/detail', { title: 'Invoice - print', item });
    } catch (error) {
      return next(error);
    }
  }


};
