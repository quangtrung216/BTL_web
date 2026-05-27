module.exports = (app) => {
  app.use('/', require('./client/home.routes'));
  app.use('/', require('./client/table.routes'));
  app.use('/products', require('./client/product.routes'));
  app.use('/cart', require('./client/cart.routes'));
  app.use('/checkout', require('./client/checkout.routes'));
  app.use('/orders', require('./client/order.routes'));
  app.use('/', require('./client/auth.routes'));
  app.use('/profile', require('./client/profile.routes'));
  app.use('/promotions', require('./client/promotion.routes'));
  app.use('/contact', require('./client/contact.routes'));
  app.use('/reservation', require('./client/contact.routes'));
  app.use('/', require('./client/page.routes'));

  app.use('/admin', require('./admin/dashboard.routes'));
  app.use('/admin/profile', require('./admin/profile.routes'));
  app.use('/admin/products', require('./admin/product.routes'));
  app.use('/admin/categories', require('./admin/category.routes'));
  app.use('/admin/brands', require('./admin/brand.routes'));
  app.use('/admin/orders', require('./admin/order.routes'));
  app.use('/admin/reservations', require('./admin/reservation.routes'));
  app.use('/admin/invoices', require('./admin/invoice.routes'));
  app.use('/admin/imports', require('./admin/importReceipt.routes'));
  app.use('/admin/promotions', require('./admin/promotion.routes'));
  app.use('/admin/users', require('./admin/user.routes'));
  app.use('/admin/statistics', require('./admin/statistics.routes'));

  app.use('/staff', require('./staff/dashboard.routes'));
  app.use('/staff/orders', require('./staff/order.routes'));
  app.use('/staff/invoices', require('./staff/invoice.routes'));
  app.use('/staff/imports', require('./staff/importReceipt.routes'));
  app.use('/staff/statistics', require('./staff/statistics.routes'));
};
