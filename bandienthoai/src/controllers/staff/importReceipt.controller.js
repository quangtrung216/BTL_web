const importReceiptService = require('../../services/importReceipt.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await importReceiptService.getAllImportReceipts();
      return res.render('staff/imports/list', { title: 'ImportReceipt - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('staff/imports/create', { title: 'ImportReceipt - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await importReceiptService.createImportReceipt(req.body || {}, req.session.user.id);
      return res.redirect('/staff/imports');
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await importReceiptService.detail(req.params.id);
      return res.render('staff/imports/detail', { title: 'ImportReceipt - detail', item });
    } catch (error) {
      return next(error);
    }
  }


};
