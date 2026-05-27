const path = require('path');
const express = require('express');
const ejs = require('ejs');
const session = require('./src/config/session');
const registerRoutes = require('./src/routes');
const notFoundMiddleware = require('./src/middlewares/notFound.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session);

app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  res.locals.tableOrder = req.session?.tableOrder || null;
  if (req.session?.appToast) {
    res.locals.toast = req.session.appToast;
    delete req.session.appToast;
  }
  next();
});

app.use((req, res, next) => {
  const originalRender = res.render.bind(res);

  res.render = (view, locals = {}, callback) => {
    const isClientView = typeof view === 'string' && (view === 'client/home' || view.startsWith('client/'));
    const isAdminView = typeof view === 'string' && view.startsWith('admin/');

    if (!isClientView && !isAdminView) {
      return originalRender(view, locals, callback);
    }

    const mergedLocals = { ...res.locals, currentPath: req.originalUrl, ...locals };
    const viewPath = path.join(app.get('views'), `${view}.ejs`);
    const layout = isAdminView ? 'layouts/admin' : 'layouts/main';

    return ejs.renderFile(viewPath, mergedLocals, (err, html) => {
      if (err) {
        if (typeof callback === 'function') return callback(err);
        return next(err);
      }

      return originalRender(layout, { ...mergedLocals, body: html }, callback);
    });
  };

  return next();
});

app.use(express.static(path.join(__dirname, 'src/public')));

registerRoutes(app);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
