const catchAsyncEjsErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const catchAsyncApiErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { catchAsyncEjsErrors, catchAsyncApiErrors };
