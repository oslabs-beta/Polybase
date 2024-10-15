/**
 * config-management.ts
 * 
 * Manages retrieval/updating of configuration settings across the system.
 * Maintains a centralized configuration store accessible by all modules.
 * Validates config changes before applying them to ensure no invalid config changes disrupt operations.
 * (Stretch) Dynamic configuration -- allow updates to be applied on-the-fly without requiring system restart.
 */

import fs from 'fs';
import path from 'path';
import { handleError } from './error-handling';
import { logInfo, logError, safeStringify } from './logging';

// Define interface for configuration object
interface Config {
    mongo?: {
        uri: string;
    };
    postgres?: {
        connectionString: string;
    };
    redis?: {
        host: string;
        port: number;
    };
    neo4j?: {
        uri: string;
        username: string;
        password: string;
    };
    influx?: {
        uri: string;
        token: string;
        org: string;
        bucket: string;
    };
    [key: string]: any; // Allow additional properties
}

/**
 * Loads configuration input (either as a file or directly passed as an argument to Polybase).
 * 
 * @param {Config | null} [providedConfig=null] - Config object passed directly by the user.
 * @returns {Config | null} - Config object or null if loading fails.
 */
function getConfig(providedConfig: Config | null = null): Config | null {
    if (providedConfig) {
        logInfo('Using provided configuration object.');
        return providedConfig;
    }

    const configFileName = 'Polybase-Config.json';
    const configFilePath = path.resolve(__dirname, configFileName);

    try {
        if (fs.existsSync(configFilePath)) {
            const fileContent = fs.readFileSync(configFilePath, 'utf-8');
            const config: Config = JSON.parse(fileContent);

            logInfo(`Loaded configuration from file: ${configFileName}`, { config: safeStringify(config) });
            return config;
        } else {
            return handleError(`Configuration file "${configFileName}" not found.`, 404) as null;
        }
    } catch (error) {
        return handleError(`Failed to load configuration file: ${(error as Error).message}`, 500) as null;
    }
}

/**
 * Validates the config object (or JSON file).
 * 
 * @param {Config} config - Configuration object to validate.
 * @returns {boolean} - True if the configuration is valid, false otherwise.
 */
function validateConfig(config: Config | null): boolean {
    if (!config) {
        handleError('No configuration provided.', 400);
        return false;
    }

    // Add additional validation checks here
    if (!config.mongo && !config.postgres) {
        handleError('At least one database configuration (mongo, postgres, etc.) must be provided.', 400);
        return false;
    }

    return true;
}

/**
 * Placeholder function for dynamic config updates.
 * 
 * @param {Config} newConfig - New configuration object.
 * @returns {boolean} - True if the update is successful, false otherwise.
 */
function updateConfig(newConfig: Config): boolean {
    console.log('Dynamic configuration updates are not yet available.');
    return false;
}

export { getConfig, validateConfig, updateConfig };
