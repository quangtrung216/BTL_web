module.exports = {
  async about(req, res, next) {
    try {
      return res.render('client/about', { title: 'Giới thiệu' });
    } catch (error) {
      return next(error);
    }
  }
};
