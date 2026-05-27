const brandService = require('../../services/brand.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await brandService.getAllBrands();
      return res.render('admin/brands/list', { title: 'Brand - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('admin/brands/create', { title: 'Brand - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await brandService.createBrand(req.body || {});
      return res.redirect('/admin/brands');
    } catch (error) {
      return next(error);
    }
  }
,

  async showEdit(req, res, next) {
    try {
      const item = await brandService.getBrandById(req.params.id);
      return res.render('admin/brands/edit', { title: 'Brand - showEdit', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async update(req, res, next) {
    try {
      await brandService.updateBrand(req.params.id, req.body || {});
      return res.redirect('/admin/brands');
    } catch (error) {
      return next(error);
    }
  }
,

  async delete(req, res, next) {
    try {
      await brandService.deleteBrand(req.params.id);
      return res.redirect('/admin/brands');
    } catch (error) {
      return next(error);
    }
  }


};
