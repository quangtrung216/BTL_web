const categoryService = require('../../services/category.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await categoryService.getAllCategories();
      return res.render('admin/categories/list', { title: 'Category - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('admin/categories/create', { title: 'Category - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await categoryService.createCategory(req.body || {});
      return res.redirect('/admin/categories');
    } catch (error) {
      return next(error);
    }
  }
,

  async showEdit(req, res, next) {
    try {
      const item = await categoryService.getCategoryById(req.params.id);
      return res.render('admin/categories/edit', { title: 'Category - showEdit', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async update(req, res, next) {
    try {
      await categoryService.updateCategory(req.params.id, req.body || {});
      return res.redirect('/admin/categories');
    } catch (error) {
      return next(error);
    }
  }
,

  async delete(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id);
      return res.redirect('/admin/categories');
    } catch (error) {
      return next(error);
    }
  }


};
