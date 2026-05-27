const userService = require('../../services/user.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await userService.getAllUsers();
      return res.render('admin/users/list', { title: 'User - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const item = await userService.detail(req.params.id);
      return res.render('admin/users/detail', { title: 'User - detail', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('admin/users/create', { title: 'User - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async createStaff(req, res, next) {
    try {
      await userService.createStaff(req.body || {});
      return res.redirect('/admin/users');
    } catch (error) {
      return next(error);
    }
  }
,

  async createAdmin(req, res, next) {
    try {
      await userService.createAdmin(req.body || {});
      return res.redirect('/admin/users');
    } catch (error) {
      return next(error);
    }
  }
,

  async showEdit(req, res, next) {
    try {
      const item = await userService.getUserById(req.params.id);
      return res.render('admin/users/edit', { title: 'User - showEdit', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async update(req, res, next) {
    try {
      await userService.updateUser(req.params.id, req.body || {});
      return res.redirect('/admin/users');
    } catch (error) {
      return next(error);
    }
  }
,

  async toggleStatus(req, res, next) {
    try {
      await userService.toggleProductStatus(req.params.id);
      return res.redirect('/admin/users');
    } catch (error) {
      return next(error);
    }
  }
,

  async changeRole(req, res, next) {
    try {
      await userService.changeUserRole(req.params.id, req.body.role_id);
      return res.redirect('/admin/users');
    } catch (error) {
      return next(error);
    }
  }


};
