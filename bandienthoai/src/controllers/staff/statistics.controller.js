const statisticsService = require('../../services/statistics.service');

module.exports = {
  async index(req, res, next) {
    try {
      const items = await statisticsService.getDashboardSummary();
      return res.render('staff/statistics/index', { title: 'Statistics - index', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async orderStatus(req, res, next) {
    try {
      const items = await statisticsService.getOrderStatusStatistics();
      return res.render('staff/statistics/index', { title: 'Statistics - orderStatus', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async lowStock(req, res, next) {
    try {
      const items = await statisticsService.getLowStockProducts();
      return res.render('staff/statistics/index', { title: 'Statistics - lowStock', items });
    } catch (error) {
      return next(error);
    }
  }


};
