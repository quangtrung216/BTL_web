const importReceiptService = require('../../services/importReceipt.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await importReceiptService.getAllImportReceipts();
      return res.render('admin/imports/list', { title: 'ImportReceipt - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('admin/imports/create', { title: 'ImportReceipt - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await importReceiptService.createImportReceipt(req.body || {}, req.session.user.id);
      return res.redirect('/admin/imports');
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await importReceiptService.detail(req.params.id);
      return res.render('admin/imports/detail', { title: 'ImportReceipt - detail', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async delete(req, res, next) {
    try {
      await importReceiptService.deleteImportReceiptSoft(req.params.id);
      return res.redirect('/admin/imports');
    } catch (error) {
      return next(error);
    }
  }


};
