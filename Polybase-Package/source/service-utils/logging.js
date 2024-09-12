/**
 * logging.js
 * 
 * captures any logs from modules across the app --e.g. query exec details, 
 * transaction statuses, errors encountered, etc.
 * 
 * Should multiple log levels (INFO, WARN, ERROR) to categorize event severity.
 * The configurable output allows logs to be written to console, files. For stretch, 
 * functions for performance monitoring by logging metrics related to db operations.
 * Used for debugging, troubleshooting, and doing any performance analysis throughout 
 * application lifecycle.
 */
// logging.js

const fs = require('fs');
const path = require('path');

// Define log levels
const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

//config object for loading
const logConfig = {
    logToConsole: true,
    logToFile: true,
    logFilePath: path.resolve(__dirname, 'polybase.log'),  //default log file -file added to directory
    logLevel: LOG_LEVELS.INFO  //default log level is info
};

/**
 * @TODO - need to update the confg levels of 
 */

/**
 * logs a message with a given level for loggin file
 * 
 * @param {string} level severity level of the log (INFO, WARN, ERROR)
 * @param {string} message  message to log
 * @param {Object} [meta] additional metadata to log, e.g. query details
 */
function log(level, message, meta = {}, isConsoleMessage = false) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message} ${safeStringify(meta)} \n`;

    //log high-level messages in the console only if specified
    if (isConsoleMessage && logConfig.logToConsole) {
        console.log(logEntry);
    }

    //set always log to file 
    if (logConfig.logToFile) {
        fs.appendFileSync(logConfig.logFilePath, logEntry + '\n', 'utf8');
    }
}


/**
 * loggin information message @TODO: need to separate console and file
 * 
 * @param {string} message The message to log
 * @param {Object} [meta] Optional additional metadata to log
 */
// Logs high-level info to the console, detailed logs to the file
function logInfo(message, meta = {}, showInConsole = false) {
    // High-level messages will be shown in the console
    const isConsoleMessage = showInConsole;
    log(LOG_LEVELS.INFO, message, meta, isConsoleMessage);
}

/**
 * log a warning message.
 * 
 * @param {string} message The message to log
 * @param {Object} [meta] Optional additional metadata to log
 */
function logWarn(message, meta = {}) {
    if ([LOG_LEVELS.WARN, LOG_LEVELS.ERROR].includes(logConfig.logLevel)) {
        log(LOG_LEVELS.WARN, message, meta);
    }
}

/**
 * Logs an error message.
 * 
 * @param {string} message The message to log
 * @param {Object} [meta] Optional additional metadata to log
 */
function logError(message, meta = {}) {
    log(LOG_LEVELS.ERROR, message, meta);
}

/**
 * sets the config obj for logging.
 * 
 * @param {Object} config Configuration object with log settings
 */
function setLogConfig(config) {
    Object.assign(logConfig, config);
}

/**
 * Placeholder for logging performance metrics related to DB operations.
 * 
 * @param {string} operation The operation being logged (e.g., 'query', 'transaction')
 * @param {Object} metrics Metrics related to the operation (e.g., duration, row count)
 */
function logPerformanceMetrics(operation, metrics) {
    logInfo(`Performance Metrics for ${operation}`, metrics);
}

function safeStringify(obj, space = 2) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    }, space);
}

module.exports = {
    safeStringify,
    logInfo,
    logWarn,
    logError,
    setLogConfig,
    logPerformanceMetrics
};
