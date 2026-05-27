const reservationService = require('../../services/reservation.service');

module.exports = {
  async showForm(req, res, next) {
    try {
      const reservations = req.session?.user?.id
        ? await reservationService.getReservationsByUser(req.session.user.id)
        : [];
      return res.render('client/contact', { title: 'Reservation', pageClass: 'reservation-page-body', reservations });
    } catch (error) {
      return next(error);
    }
  }
,

  async submit(req, res, next) {
    try {
      const data = req.body || {};
      const result = await reservationService.createReservation(req.session?.user?.id, data);
      if (!result.ok) {
        const reservations = req.session?.user?.id
          ? await reservationService.getReservationsByUser(req.session.user.id)
          : [];
        return res.render('client/contact', {
          title: 'Reservation',
          pageClass: 'reservation-page-body',
          error: result.message,
          reservations
        });
      }
      req.session.appToast = {
        type: 'success',
        title: 'Đã gửi yêu cầu đặt bàn',
        message: 'Brew Haven đã ghi nhận yêu cầu của bạn và sẽ sớm liên hệ xác nhận.'
      };
      return res.redirect('/reservation');
    } catch (error) {
      return next(error);
    }
  }


};
