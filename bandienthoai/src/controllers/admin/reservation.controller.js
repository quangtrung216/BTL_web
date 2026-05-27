const reservationService = require('../../services/reservation.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await reservationService.getAllReservations();
      return res.render('admin/reservations/list', { title: 'Duyệt đặt bàn', items });
    } catch (error) {
      return next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      await reservationService.updateReservationStatus(req.params.id, req.body.status || 'pending');
      return res.redirect('/admin/reservations');
    } catch (error) {
      return next(error);
    }
  }
};
