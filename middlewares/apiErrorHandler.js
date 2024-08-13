class ApiError extends Error {
    constructor(statusCode, message, type = "error") {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.type = type;
    }
}

const apiErrorHandler = (err, req, res, next) => {
    if (req.path.startsWith('/api')) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        const type = err.type || "error";
        console.error(err);

        if (err.code === 11000 ) {
            return res.status(400).json({
                status: 400,
                type: 'error',
                message: `${Object.keys(err.keyValue)[0]} already exists.`,
            });
        }
        
        return res.status(statusCode).json({
            status: statusCode || 500,
            type,
            message,
        });
    }
    next(err);
};

module.exports = { ApiError, apiErrorHandler };
