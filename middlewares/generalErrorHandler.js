const generalErrorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging

    res.status(err.statusCode || 500).json({
        status: err.statusCode || 500,
        message: err.message || 'An unexpected error occurred.',
    });
};

module.exports = generalErrorHandler;
