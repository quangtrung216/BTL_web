const productService = require('../../services/product.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await productService.getAllProducts();
      return res.render('admin/products/list', { title: 'Product - list', items });
    } catch (error) {
      return next(error);
    }
  }
,

  async showCreate(req, res, next) {
    try {
      return res.render('admin/products/create', { title: 'Product - showCreate', item: null });
    } catch (error) {
      return next(error);
    }
  }
,

  async create(req, res, next) {
    try {
      await productService.createProduct(req.body || {});
      return res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }
,

  async showEdit(req, res, next) {
    try {
      const item = await productService.getProductById(req.params.id);
      return res.render('admin/products/edit', { title: 'Product - showEdit', item });
    } catch (error) {
      return next(error);
    }
  }
,

  async update(req, res, next) {
    try {
      await productService.updateProduct(req.params.id, req.body || {});
      return res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }
,

  async delete(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      return res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }
,

  async toggleStatus(req, res, next) {
    try {
      await productService.toggleProductStatus(req.params.id);
      return res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }


};
