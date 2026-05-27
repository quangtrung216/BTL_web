function normalizeTableCode(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 20)
    .toUpperCase();
}

module.exports = {
  start(req, res) {
    const code = normalizeTableCode(req.params.tableCode);

    if (!code) {
      req.session.appToast = {
        type: 'error',
        title: 'Mã bàn không hợp lệ',
        message: 'Vui lòng quét lại mã QR trên bàn.'
      };
      return res.redirect('/products');
    }

    req.session.tableOrder = {
      code,
      label: `Bàn ${code}`,
      startedAt: new Date().toISOString()
    };

    req.session.appToast = {
      type: 'success',
      title: `Đang đặt món cho bàn ${code}`,
      message: 'Bạn có thể chọn món và gửi đơn trực tiếp tới quầy.'
    };

    return res.redirect('/products');
  },

  clear(req, res) {
    delete req.session.tableOrder;
    delete req.session.guestCart;
    delete req.session.cartPromotionCode;
    return res.redirect('/');
  }
};
