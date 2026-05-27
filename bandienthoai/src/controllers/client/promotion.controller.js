const promotionService = require('../../services/promotion.service');

module.exports = {
  async index(req, res, next) {
    try {
      const items = await promotionService.getAllPromotions();
      return res.render('client/promotions', { title: 'Promotions', pageClass: 'promotions-page', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await promotionService.getPromotionById(req.params.id);
      return res.render('client/promotions', { title: 'Promotion Detail', pageClass: 'promotions-page', items: item ? [item] : [], item });
    } catch (error) {
      return next(error);
    }
  }


};
