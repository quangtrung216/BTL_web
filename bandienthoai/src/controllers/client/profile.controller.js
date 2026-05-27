const profileService = require('../../services/user.service');

module.exports = {
  async index(req, res, next) {
    try {
      const item = await profileService.getUserById(req.session.user.id);
      return res.render('client/profile/index', { title: 'Profile', pageClass: 'profile-page', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async updateProfile(req, res, next) {
    try {
      await profileService.updateProfile(req.session.user.id, req.body || {});
      return res.redirect('/profile');
    } catch (error) {
      return next(error);
    }
  }


};
