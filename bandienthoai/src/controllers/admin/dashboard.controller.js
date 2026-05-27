const dashboardService = require('../../services/statistics.service');

module.exports = {
  async index(req, res, next) {
    try {
      const items = await dashboardService.getDashboardSummary();
      return res.render('admin/dashboard', { title: 'Dashboard - index', items });
    } catch (error) {
      return next(error);
    }
  }


};
