module.exports = (error, req, res, next) => {
  console.error(error);
  return res.status(500).render('client/errors/500');
};
