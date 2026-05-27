const profileService = require('../../services/user.service');

module.exports = {
  async index(req, res, next) {
    try {
      const item = await profileService.getUserById(req.session.user.id);
      return res.render('admin/profile/index', { title: 'Hồ sơ admin', item });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      await profileService.updateProfile(req.session.user.id, req.body || {});
      req.session.user = {
        ...req.session.user,
        full_name: req.body.full_name || req.session.user.full_name,
        phone: req.body.phone || '',
        address: req.body.address || ''
      };
      return res.redirect('/admin/profile');
    } catch (error) {
      return next(error);
    }
  }
};
