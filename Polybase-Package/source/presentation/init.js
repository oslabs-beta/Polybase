/**
 * init.js
 * 
 * Responsible for initializing the Polybase environment
 * Sets up the necessary configurations, establishing connections to the specified databases.
 */
const { configureMongoConnection, configureRedisConnection, configurePostgresConnection, configureNeo4jConnection, configureInfluxConnection } = require('../service-utils/connection-pool');
const { cliInterface } = require('./cli-interface');
const { getConfig, validateConfig } = require('../service-utils/config-management');
const { manageState } = require('../service-utils/state-utils');
const { handleError } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');

/** 
 * manages initialization and state of Polybase 
 * (connections, configurations, etc.)
 */
const PolyBaseInstance = {
    interfaces: {}, // stores db interfaces connected in session

    // initializes Polybase with provided interfaces
    init(interfaces) {
        this.interfaces = interfaces;
        logInfo('Polybase instance initialized with interfaces', { interfaces });
    },

    // retrieves interface for a specific db type
    getInterface(dbType) {
        return this.interfaces[dbType];
    }
};

/**
 * est connections for each database in user config
 * @param {Object} config - User's configuration object (databases to manage)
 * @returns interfaces for connected databases
 */
async function configureDatabaseConnections(config) {
    const interfaces = {};
    for (const [dbType, dbConfig] of Object.entries(config)) {
        try {
            let connection;
            switch (dbType) {
                case 'mongo':
                    connection = await configureMongoConnection(dbConfig);
                    // schema = await getMongoSchema(connection);
                    // console.log('mongo schema is :', schema);
                    break;
                case 'redis':
                    connection = await configureRedisConnection(dbConfig);
                    // schema = await getRedisKeyspace(connection);
                    // console.log('Redis schema is', schema);
                    break;
                case 'influx':
                    console.log(dbType);
                    connection = await configureInfluxConnection(dbConfig);
                    // schema = await getInfluxMeasurements(connection);
                    // console.log('Influx schema is:', schema)
                    break;
                case 'neo4j':
                    connection = await configureNeo4jConnection(dbConfig);
                    // schema = await getNeo4jMetadata(connection);
                    // console.log('Neo4j MetaData is:', schema)
                    break;
                case 'postgres':
                    connection = await configurePostgresConnection(dbConfig);
                    // schema = await getPostgresSchema(connection);
                    // console.log('Postgres Schema is:', schema)
                    break;
                default:
                    throw new Error(`Unsupported database type: ${dbType}`);
            }
            interfaces[dbType] = connection; // Store connection
            manageState(dbType, connection, dbConfig); // Manage state (each db connection has a slice)
        } catch (error) {
            logError(`Failed to connect to ${dbType}`, { error });
            return handleError(`Failed to connect to ${dbType}: ${error.message}`, 500);
        }
    }
    return interfaces;
}

/**
 * init Polybase with user config and starts necessary services
 * @param {Object} config - User's configuration object
 * @returns Initialized Polybase instance
 */
async function initPolybase(config) {
    // console.log('CONFIG OBJECT', config);
    const interfaces = await configureDatabaseConnections(config);
    if (!interfaces) {
        throw handleError('Failed to initialize database connections', 500);
    }

    PolyBaseInstance.init(interfaces); // init Polybase with interfaces

    logInfo('✔ Polybase initialized with configured interfaces.', { interfaces });
    console.log('✔ Polybase initialized with configured interfaces:', Object.keys(interfaces)); // Log interfaces to console

    //after successful initialization, start the CLI
    cliInterface();

    return PolyBaseInstance;
}

/**
 * Starts Polybase with the given config
 * @param {Object} config - User's configuration object
 */
const fs = require('fs');
const path = require('path');

async function startPolybase(config = null) {
    let finalConfig;

    // if config is a string, like fp and load json 
    if (typeof config === 'string') {
        const configFilePath = path.resolve(process.cwd(), config);
        if (fs.existsSync(configFilePath)) {
            const fileContent = fs.readFileSync(configFilePath, 'utf-8');
            finalConfig = JSON.parse(fileContent);  // Parse the JSON config file
            console.log('Configuration loaded from file:', configFilePath);
        } else {
            return handleError('Configuration file not found.', 400);
        }
    }
    //if config obj, use it directly
    else if (typeof config === 'object' && config !== null) {
        finalConfig = config;
        console.log('Configuration object provided directly.');
    }
    //if no valid config, log
    else {
        return handleError('No valid configuration provided.', 400);
    }

    //valiudate config file
    if (!validateConfig(finalConfig)) {
        return handleError('Invalid configuration. Initialization aborted.', 400); //handle bad config
    }

    //init pb with final validated config (doesn't mean will connect )
    const polybase = await initPolybase(finalConfig);
    if (!polybase) {
        return handleError('Failed to start Polybase.', 500);
    }
}



module.exports = { initPolybase, startPolybase, configureDatabaseConnections };
