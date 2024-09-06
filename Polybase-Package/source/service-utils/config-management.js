/**
 * config-management.js
 * 
 * manages retrieval/updating of specifically the configuration settings across the system.
 * maintains centralized configuration store accessible by all modules.
 * validates config changes before applying them to ensure no invalid config chagnes screw 
 * up operations (before they try to occur) 
 * (stretch) dynamic configuration --allow updates to be applied on-the-fly w/o requiring system restart.
 * overall, just ensure that Polybase operates according to the settings the user
 * defines and then adatps to changes in the configuration as needed. 
 * 
 *
 */
const fs = require('fs');
const path = require('path');
const { handleError } = require('./error-handling');
const { logInfo, logError, safeStringify } = require('./logging');


/**
 * Loads configuration input (either as file or directly passed as an 
 * argumen to Polybase parameter.
 * 
 * @param {Object} [providedConfig=null] Config object passed directly by user
 * @returns {Object|null} Config object or null if loading failure
 */
function getConfig(providedConfig = null) {
    
    //check if configuration object provided
    if (providedConfig) {
        logInfo('Using provided configuration object.');
        return providedConfig;
    }

    //Standardized polybase configuration file.
    const configFileName = 'Polybase-Config.json';
    const configFilePath = path.resolve(__dirname, configFileName);

    //Reolve path in current directory and parse as a config object
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

/**
 * Validates the confg object (or json file)
 * 
 * @param {Object} config - Configuration object to validate
 * @returns {Boolean} - True if the configuration is valid, false otherwise.
 */
function validateConfig(config) {
    if (!config) {
        handleError('No configuration provided.', 400);
        return false;
    }

    // /**
    //  * @TODO add additional validation checks
        //need to add validation logic here --checking required fields, types, etc.
    //  */
    // if (!config.mongo && !config.postgres) {
    //     handleError('At least one database configuration (mongo, postgres, etc.) must be provided.', 400);
    //     return false;
    // }

    return true;
}

/**
 * placeholder func for dynamic
 * config updates
 * 
 * @param {Object} newConfig - New configuration object.
 * @returns {Boolean} - True if the update is successful, false otherwise.
 */
function updateConfig(newConfig) {
    // Implement dynamic configuration updates here - mayb estretch feat
    console.log('Dynamic configuration updates are yet availl.');
    return false;
}

module.exports = {
    getConfig,
    validateConfig,
    updateConfig,
};
