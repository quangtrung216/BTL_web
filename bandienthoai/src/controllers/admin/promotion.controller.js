const promotionService = require('../../services/promotion.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await promotionService.list();
      return res.render('admin/promotions/list', { title: 'Promotion - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('admin/promotions/create', { title: 'Promotion - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await promotionService.createPromotion(req.body || {});
      return res.redirect('/admin/promotions');
    } catch (error) {
      return next(error);
    }
  }
,

  async showEdit(req, res, next) {
    try {
      const item = await promotionService.getPromotionById(req.params.id);
      return res.render('admin/promotions/edit', { title: 'Promotion - showEdit', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async update(req, res, next) {
    try {
      await promotionService.updatePromotion(req.params.id, req.body || {});
      return res.redirect('/admin/promotions');
    } catch (error) {
      return next(error);
    }
  }
,

  async delete(req, res, next) {
    try {
      await promotionService.deletePromotion(req.params.id);
      return res.redirect('/admin/promotions');
    } catch (error) {
      return next(error);
    }
  }
,

  async assignProducts(req, res, next) {
    try {
      await promotionService.assignProductsToPromotion(req.params.id, req.body.product_ids || []);
      return res.redirect('/admin/promotions');
    } catch (error) {
      return next(error);
    }
  }
,

  async removeProduct(req, res, next) {
    try {
      await promotionService.removeProductFromPromotion(req.params.id, req.params.productId);
      return res.redirect('/admin/promotions');
    } catch (error) {
      return next(error);
    }
  }


};
