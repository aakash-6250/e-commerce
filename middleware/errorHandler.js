const errorHandler = (req, res, next) => {
    if (req.session.errorMessage) {
      res.locals.errorMessage = req.session.errorMessage;
      res.locals.messageType = req.session.messageType;
      req.session.errorMessage = undefined;
      req.session.messageType = undefined;
    } else {
      res.locals.errorMessage = null;
      res.locals.messageType = null;
    }
    next();
  };
  
  module.exports = errorHandler;
  