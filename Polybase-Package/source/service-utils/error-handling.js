/*

 - Centralizes error management across the entire application.
 - Logs errors with detailed information, including stack traces, for debugging.
 - Generates clear, user-friendly error messages for clients.
 - Ensures consistent error handling and logging throughout all layers of the app.
 - Provides a single point of contact for error handling to maintain consistency.
 - (Stretch goal) Facilitates recovery mechanisms to enhance app stability after errors.
 
 */

const { logInfo, logError, safeStringify } = require('./logging');

// Validates if input is a non-empty object
function validateInput(input) {
    return typeof input === 'object' && input !== null && Object.keys(input).length > 0;
}

// Handles errors by logging them and returning standardized output
function handleError(error, code = 500) {
    if (typeof error === 'string') {
        error = new Error(error);
    }
    logError(error.message, { stack: safeStringify(error.stack) });
    return generateErrorResponse(error.message, code);
}

// Generates a standardized error response object
function generateErrorResponse(message, code = 500, details = '') {
    return {
        success: false,
        error: {
            message,
            code,
            details,
            timestamp: new Date().toISOString()
        }
    };
}

module.exports = { logError, handleError, generateErrorResponse, validateInput };