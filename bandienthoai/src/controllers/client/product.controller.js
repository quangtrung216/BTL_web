const productService = require('../../services/product.service');
const reviewService = require('../../services/review.service');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await productService.getAvailableProducts();
      return res.render('client/products/list', { title: 'Menu', pageClass: 'menu-page', items, query: req.query || {} });
    } catch (error) {
      return next(error);
    }
  }
,

  async detail(req, res, next) {
    try {
      const data = await productService.getProductDetail(req.params.id);
      const reviewData = data.product ? await reviewService.getReviewsByProduct(data.product.id) : { rows: [], count: 0, averageRating: 0 };
      return res.render('client/products/detail', {
        title: data.product ? data.product.name : 'Product detail',
        pageClass: 'product-detail-page',
        product: data.product || null,
        item: data.product || null,
        images: data.images || [],
        sizes: data.sizes || [],
        toppings: data.toppings || [],
        relatedProducts: data.relatedProducts || [],
        reviews: reviewData.rows,
        reviewSummary: {
          count: reviewData.count,
          averageRating: reviewData.averageRating
        }
      });
    } catch (error) {
      return next(error);
    }
  }
,

  async search(req, res, next) {
    try {
      const items = await productService.searchProducts(req.query);
      return res.render('client/products/list', { title: 'Menu', pageClass: 'menu-page', items, query: req.query || {} });
    } catch (error) {
      return next(error);
    }
  }
,

  async filter(req, res, next) {
    try {
      const items = await productService.filterProducts(req.query);
      return res.render('client/products/list', { title: 'Menu', pageClass: 'menu-page', items, query: req.query || {} });
    } catch (error) {
      return next(error);
    }
  }


};
