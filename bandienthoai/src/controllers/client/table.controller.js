const tableService = require('../../services/table.service');

module.exports = {
  async start(req, res, next) {
    try {
      const code = tableService.normalizeTableCode(req.params.tableCode);

      if (!code) {
        req.session.appToast = {
          type: 'error',
          title: 'Mã bàn không hợp lệ',
          message: 'Vui lòng quét lại mã QR trên bàn.'
        };
        return res.redirect('/products');
      }

      const table = await tableService.findActiveByCode(code);
      if (!table) {
        req.session.appToast = {
          type: 'error',
          title: 'Không tìm thấy bàn',
          message: 'Mã QR này chưa khớp với bàn đang hoạt động trong hệ thống.'
        };
        return res.redirect('/products');
      }

      req.session.tableOrder = {
        id: table.id,
        code: table.table_code,
        label: table.name || `Bàn ${table.table_code}`,
        capacity: table.capacity,
        status: table.status,
        location: table.location,
        startedAt: new Date().toISOString()
      };

      req.session.appToast = {
        type: 'success',
        title: `Đang đặt món cho ${req.session.tableOrder.label}`,
        message: 'Bạn có thể chọn món và gửi đơn trực tiếp tới quầy.'
      };

      return res.redirect('/products');
    } catch (error) {
      return next(error);
    }
  },

  clear(req, res) {
    delete req.session.tableOrder;
    delete req.session.guestCart;
    delete req.session.cartPromotionCode;
    return res.redirect('/');
  }
};
