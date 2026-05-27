module.exports = (req, res) => {
  return res.status(404).render('client/errors/404');
};
