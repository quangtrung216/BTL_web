const ROLES = require('../constants/roles');

function requireAdmin(req, res, next) {
  if (req.session?.user?.role !== ROLES.ADMIN) {
    return res.status(403).send('Forbidden');
  }
  return next();
}

function requireAdminOrStaff(req, res, next) {
  const role = req.session?.user?.role;
  if (role !== ROLES.ADMIN && role !== ROLES.STAFF) {
    return res.status(403).send('Forbidden');
  }
  return next();
}

function requireCustomer(req, res, next) {
  if (req.session?.user?.role !== ROLES.CUSTOMER) {
    return res.status(403).send('Forbidden');
  }
  return next();
}

module.exports = { requireAdmin, requireAdminOrStaff, requireCustomer };
