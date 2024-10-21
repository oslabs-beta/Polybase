/*

 - Manages logging across the application for debugging, troubleshooting, and performance analysis.
 - Supports multiple log levels: INFO, WARN, and ERROR.
 - Logs can be output to both the console and a log file.
 - Provides methods to log general information, warnings, errors, and performance metrics.
 - Configurable logging settings, including log levels and output destinations.
 - Includes a utility function for safely stringifying objects to avoid circular references.

 */

const fs = require('fs');
const path = require('path');

// Define log levels for categorizing log severity
const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

// Configuration object for logging settings
const logConfig = {
    logToConsole: true,
    logToFile: true,
    logFilePath: path.resolve(__dirname, 'polybase.log'),
    logLevel: LOG_LEVELS.INFO
};

// Logs messages to console and file based on severity level
function log(level, message, meta = {}, isConsoleMessage = false) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message} ${safeStringify(meta)} \n`;

    if (isConsoleMessage && logConfig.logToConsole) {
        console.log(logEntry);
    }

    if (logConfig.logToFile) {
        fs.appendFileSync(logConfig.logFilePath, logEntry + '\n', 'utf8');
    }
}

// Logs high-level info to the console and detailed logs to the file
function logInfo(message, meta = {}, showInConsole = false) {
    log(LOG_LEVELS.INFO, message, meta, showInConsole);
}

// Logs warning messages
function logWarn(message, meta = {}) {
    if ([LOG_LEVELS.WARN, LOG_LEVELS.ERROR].includes(logConfig.logLevel)) {
        log(LOG_LEVELS.WARN, message, meta);
    }
}

// Logs error messages
function logError(message, meta = {}) {
    log(LOG_LEVELS.ERROR, message, meta);
}

// Updates the logging configuration
function setLogConfig(config) {
    Object.assign(logConfig, config);
}

// Logs performance metrics related to database operations
function logPerformanceMetrics(operation, metrics) {
    logInfo(`Performance Metrics for ${operation}`, metrics);
}

// Safely stringifies objects to avoid circular references
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