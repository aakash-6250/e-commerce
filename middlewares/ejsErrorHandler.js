const ejsErrorHandler = (err, req, res, next) => {
  if (!req.path.startsWith('/api')) {
      const statusCode = err.statusCode || 500;
      const message = err.statusCode == 404 ? "Page Not Found" : err.message;
      const type = err.type || 'error';
      
      res.status(statusCode).render('error', {
          type,
          status: statusCode,
          message,
          redirect: req.headers.referer || '/'
      });
  } else {
      next(err);
  }
};

module.exports = ejsErrorHandler;
