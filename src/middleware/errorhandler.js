import AppError from "../utils/appError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    if(err.name === 'TokenExpiredError') {
        err = new AppError('Token is expired, please login again', 401);
    }

    if(err.name === 'JsonWebTokenError') {
        err = new AppError ('Invalid token, please login again with valid token ', 401)
    }

    err.statusCode = err.statusCode || 500;

    logger.error ({
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl
    })

    
    if(process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack
        });
    } else {
        if(err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            return res.status(500).json ({
                status: 'error',
                message: 'Something went wrong'
            })
        }
    }
};

export default errorHandler;