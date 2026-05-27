const dashboardService = require('../../services/statistics.service');

module.exports = {
  async index(req, res, next) {
    try {
      const [items, revenueChart, topProducts, recentOrders] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getRevenueForLastDays(7),
        dashboardService.getTopSellingProducts(5),
        dashboardService.getRecentOrders(4)
      ]);
      return res.render('admin/dashboard', { title: 'Dashboard - index', items, revenueChart, topProducts, recentOrders });
    } catch (error) {
      return next(error);
    }
  }


};
