"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }
    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            success: false,
            error: 'Database operation failed',
        });
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({
            success: false,
            error: 'Invalid token',
        });
    }
    // Default error
    return res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
}
//# sourceMappingURL=error.middleware.js.map