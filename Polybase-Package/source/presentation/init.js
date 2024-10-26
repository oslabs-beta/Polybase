/* 

 - Initializes the Polybase environment.
 - Sets up configurations and establishes connections to specified databases.
 - Validates user-provided configurations before initializing.
 - Manages database connections and tracks their states.
 - Starts the Polybase instance and initializes the CLI interface.
 - Supports MongoDB, Redis, PostgreSQL, Neo4j, and InfluxDB connections.
 - Handles errors during database connections and configuration.

 */

const { configureMongoConnection, configureRedisConnection, configurePostgresConnection, configureNeo4jConnection, configureInfluxConnection } = require('../service-utils/connection-pool');
const { cliInterface } = require('./cli-interface');
const { getConfig, validateConfig } = require('../service-utils/config-management');
const { manageState } = require('../service-utils/state-utils');
const { handleError } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');


const PolyBaseInstance = {
    interfaces: {},

    init(interfaces) {
        this.interfaces = interfaces;
        logInfo('Polybase instance initialized with interfaces', { interfaces });
    },

    getInterface(dbType) {
        return this.interfaces[dbType];
    }
};

async function configureDatabaseConnections(config) {
    const interfaces = {};
    for (const [dbType, dbConfig] of Object.entries(config)) {
        try {
            let connection;
            switch (dbType) {
                case 'mongo':
                    connection = await configureMongoConnection(dbConfig);
                    break;
                case 'redis':
                    connection = await configureRedisConnection(dbConfig);
                    break;
                case 'influx':
                    console.log(dbType);
                    connection = await configureInfluxConnection(dbConfig);
                    break;
                case 'neo4j':
                    connection = await configureNeo4jConnection(dbConfig);
                    break;
                case 'postgres':
                    connection = await configurePostgresConnection(dbConfig);
                    break;
                default:
                    throw new Error(`Unsupported database type: ${dbType}`);
            }
            interfaces[dbType] = connection;
            manageState(dbType, connection, dbConfig);
        } catch (error) {
            logError(`Failed to connect to ${dbType}`, { error });
            return handleError(`Failed to connect to ${dbType}: ${error.message}`, 500);
        }
    }
    return interfaces;
}

async function initPolybase(config) {
    const interfaces = await configureDatabaseConnections(config);
    if (!interfaces) {
        throw handleError('Failed to initialize database connections', 500);
    }

    PolyBaseInstance.init(interfaces);

    logInfo('✔ Polybase initialized with configured interfaces.', { interfaces });
    console.log('✔ Polybase initialized with configured interfaces:', Object.keys(interfaces));

    cliInterface();

    return PolyBaseInstance;
}

const fs = require('fs');
const path = require('path');
const { config } = require('process');

async function startPolybase(config = null) {
    let finalConfig;

    if (typeof config === 'string') {
        const configFilePath = path.resolve(process.cwd(), config);
        if (fs.existsSync(configFilePath)) {
            const fileContent = fs.readFileSync(configFilePath, 'utf-8');
            finalConfig = JSON.parse(fileContent);
            console.log('Configuration loaded from file:', configFilePath);
        } else {
            return handleError('Configuration file not found.', 400);
        }
    }

    else if (typeof config === 'object' && config !== null) {
        finalConfig = config;
        console.log('Configuration object provided directly.');
    }

    else {
        return handleError('No valid configuration provided.', 400);
    }

    if (!validateConfig(finalConfig)) {
        return handleError('Invalid configuration. Initialization aborted.', 400);
    }

    const polybase = await initPolybase(finalConfig);
    if (!polybase) {
        return handleError('Failed to start Polybase.', 500);
    }
}



module.exports = { initPolybase, startPolybase, configureDatabaseConnections };
