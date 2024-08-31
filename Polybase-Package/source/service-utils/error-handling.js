/**
 * error-handling.js
 * 
 * cenralize err management across app -collecting and managing errors from all layers.
 * logs errors with detailed information, including stack traces, to assist in debugging and troubleshooting.
 * generates clear/user-friendly error messages that are returned to the client to help them understand and resolve issues.
 * acts as singe poc for error handling -ensures that all errors are consistently managed and logged.
 * 
 * (stretch) - facilates recovery mechanisms in case of errors - help maintain stability.
 */


/**
 * Validates that the provided that parsed command is a non-empty
 * object with at least 1 key
 * 
 * @param {*} input The input to validate
 * @returns {boolean} True if the input is a valid non-empty object, otherwise false
 */
function validateInput(input) {
    return typeof input === 'object' && input !== null && Object.keys(input).length > 0;

    //need to extend
}

/**
 * handles errors by logging and returning standardized
 * output
 * 
 * @param {Error|string} error The error object or message to handle
 * @param {number} [code=500] Optional error code to include in the response
 * @returns {Object} The standardized error response object
 */
function handleError(error, code = 500) {
    if (typeof error === 'string') {
        error = new Error(error);
    }
    logError(error);
    return generateErrorResponse(error.message, code);
}
/**
 * Logs errow with stack trace and detailed information 
 * 
 * @param {Error|string} error The error object or message to log
 */
function logError(error) {
    //standardize format
    const errorMessage = typeof error === 'string' ? error : error.message;
    console.error(`[${new Date().toISOString()}] Error: ${errorMessage}`);
    if (error.stack) {
        console.error(error.stack);
    }
}

/**
 * generateErrorResponse
 * 
 * Creates a standardized error response object.
 * This can be used across the application to ensure consistent error messaging.
 * 
 * @param {string} message The error message to include in the response
 * @param {number} [code] Optional error code to include
 * @param {string} [details] Optional additional details about the error
 * @returns {Object} The error response object
 */
function generateErrorResponse(message, code = 500, details = '') {
    //return custom error message
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

module.exports = { logError, generateErrorResponse, validateInput };

