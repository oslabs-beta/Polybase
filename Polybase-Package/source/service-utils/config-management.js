/*

 - Manages retrieval and updating of configuration settings across the system.
 - Maintains a centralized configuration store accessible by all modules.
 - Validates configuration changes to prevent invalid configurations from disrupting operations.
 - Supports loading configurations from files or directly passed objects.
 - (Stretch) Dynamic configuration updates to apply changes without requiring a system restart.

*/

const fs = require('fs');
const path = require('path');
const { handleError } = require('./error-handling');
const { logInfo, logError, safeStringify } = require('./logging');

// Loads configuration input from a file or directly passed by the user
function getConfig(providedConfig = null) {
    if (providedConfig) {
        logInfo('Using provided configuration object.');
        return providedConfig;
    }

    const configFileName = 'Polybase-Config.json';
    const configFilePath = path.resolve(__dirname, configFileName);

    try {
        if (fs.existsSync(configFilePath)) {
            const fileContent = fs.readFileSync(configFilePath, 'utf-8');
            const config = JSON.parse(fileContent);
            logInfo(`Loaded configuration from file: ${configFileName}`);
            return config;
        } else {
            return handleError(`Configuration file "${configFileName}" not found.`, 404);
        }
    } catch (error) {
        return handleError(`Failed to load configuration file: ${error.message}`, 500);
    }
}

// Validates the provided configuration object or file
function validateConfig(config) {
    if (!config) {
        handleError('No configuration provided.', 400);
        return false;
    }

    return true;
}

// Placeholder for dynamic configuration updates (stretch feature)
function updateConfig(newConfig) {
    console.log('Dynamic configuration updates are not available yet.');
    return false;
}

module.exports = {
    getConfig,
    validateConfig,
    updateConfig,
};