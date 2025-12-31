const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

/**
 * Centralized error handling middleware
 * Detects API error types and returns user-friendly messages
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // If not an ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message);
    }

    // Detect specific API error types and provide user-friendly messages
    let userMessage = error.message;
    let errorType = 'general';

    // HTTP status code detection
    if (error.statusCode === 401 || error.statusCode === 403) {
        errorType = 'auth';
        userMessage = 'Authentication failed. Please check your API credentials.';
    } else if (error.statusCode === 429) {
        errorType = 'rate_limit';
        userMessage = 'Rate limit exceeded. Please try again in a few moments.';
    } else if (error.statusCode === 410) {
        errorType = 'quota_exceeded';
        userMessage = 'API quota exceeded. The system will use fallback mode.';
    }

    // Error message pattern detection
    if (error.message && typeof error.message === 'string') {
        const msg = error.message.toLowerCase();
        if (msg.includes('quota') || msg.includes('limit exceeded')) {
            errorType = 'quota_exceeded';
            userMessage = 'API quota exceeded. Using fallback generation mode.';
        } else if (msg.includes('rate limit') || msg.includes('too many requests')) {
            errorType = 'rate_limit';
            userMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (msg.includes('unauthorized') || msg.includes('authentication')) {
            errorType = 'auth';
            userMessage = 'API authentication failed. Check your credentials.';
        }
    }

    // Log the error with context
    logger.error(`[${errorType.toUpperCase()}] ${error.message}`, {
        statusCode: error.statusCode,
        path: req.path,
        method: req.method,
        errorType,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Send response
    res.status(error.statusCode).json({
        success: false,
        error: userMessage,
        errorType,
        ...(process.env.NODE_ENV === 'development' && {
            details: error.message,
            stack: error.stack
        })
    });
};

module.exports = errorHandler;
