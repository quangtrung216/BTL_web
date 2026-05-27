module.exports = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length) {
      return res.status(400).send(errors);
    }
    return next();
  };
};
