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

module.exports = { generateErrorResponse, validateInput };

