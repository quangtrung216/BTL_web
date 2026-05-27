const statisticsService = require('../../services/statistics.service');

module.exports = {
  async index(req, res, next) {
    try {
      const items = await statisticsService.getDashboardSummary();
      return res.render('admin/statistics/index', { title: 'Statistics - index', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async revenueByDay(req, res, next) {
    try {
      const items = await statisticsService.getRevenueByDay();
      return res.render('admin/statistics/index', { title: 'Statistics - revenueByDay', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async revenueByMonth(req, res, next) {
    try {
      const items = await statisticsService.getRevenueByMonth();
      return res.render('admin/statistics/index', { title: 'Statistics - revenueByMonth', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async topSelling(req, res, next) {
    try {
      const items = await statisticsService.getTopSellingProducts();
      return res.render('admin/statistics/index', { title: 'Statistics - topSelling', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async lowStock(req, res, next) {
    try {
      const items = await statisticsService.getLowStockProducts();
      return res.render('admin/statistics/index', { title: 'Statistics - lowStock', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async orderStatus(req, res, next) {
    try {
      const items = await statisticsService.getOrderStatusStatistics();
      return res.render('admin/statistics/index', { title: 'Statistics - orderStatus', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async paymentStatus(req, res, next) {
    try {
      const items = await statisticsService.getPaymentStatusStatistics();
      return res.render('admin/statistics/index', { title: 'Statistics - paymentStatus', items });
    } catch (error) {
      return next(error);
    }
  }


};
