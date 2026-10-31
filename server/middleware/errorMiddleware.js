/**
 * Handles requests to endpoints that do not exist (404)
 */
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Global centralized error-handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Use existing status code or default to 500 (Internal Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose CastError (e.g., searching with an invalid MongoDB ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found: Invalid ID format';
    }

    // Handle Mongoose validation errors (e.g., missing title or invalid amount)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};