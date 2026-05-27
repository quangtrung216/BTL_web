const productService = require('../../services/product.service');

module.exports = {
  async index(req, res, next) {
    try {
      const featuredProducts = await productService.getFeaturedProducts(8);
      const newestProducts = await productService.getNewestProducts(8);
      const promotionProducts = await productService.getPromotionProducts(8);

      const testimonials = [
        {
          id: 1,
          name: 'Minh Anh',
          rating: 5,
          message: 'The best coffee in town. Great taste, wonderful ambience, and super friendly staff.',
          avatar: '/images/testimonials/avatar1.jpg'
        },
        {
          id: 2,
          name: 'Hoang Nam',
          rating: 5,
          message: 'I love their milk tea and the cozy vibe. Perfect place to relax or study.',
          avatar: '/images/testimonials/avatar2.jpg'
        },
        {
          id: 3,
          name: 'Thu Phuong',
          rating: 5,
          message: 'Fast service, delicious drinks and cakes. Highly recommend Brew Haven!',
          avatar: '/images/testimonials/avatar3.jpg'
        }
      ];

      return res.render('client/home', {
        title: 'Trang chu',
        pageClass: 'home-page',
        featuredProducts,
        newestProducts,
        promotionProducts,
        testimonials
      });
    } catch (error) {
      return next(error);
    }
  }
};
