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
const { getMongoSchema, getInfluxMeasurements, getPostgresSchema, getNeo4jMetadata, getRedisKeyspace } = require('../service-utils/schema-generator');

/** 
 * Manages initialization and state of Polybase 
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
 * Establishes connections for each database in user config
 * @param {Object} config - User's configuration object (databases to manage)
 * @returns interfaces for connected databases
 */
async function configureDatabaseConnections(config) {
    const interfaces = {};
    for (const [dbType, dbConfig] of Object.entries(config)) {
        try {
            let schema;
            let connection;
            switch (dbType) {
                case 'mongo':
                    connection = await configureMongoConnection(dbConfig);
                    schema = await getMongoSchema(connection);
                    console.log('mongo schema is :', schema);
                    break;
                case 'redis':
                    connection = await configureRedisConnection(dbConfig);
                    schema = await getRedisKeyspace(connection);
                    console.log('Redis schema is', schema);
                    break;
                case 'influx':
                    connection = await configureInfluxConnection(dbConfig);
                    schema = await getInfluxMeasurements(connection);
                    console.log('Influx schema is:', schema)
                    break;
                case 'neo4j':
                    connection = await configureNeo4jConnection(dbConfig);
                    schema = await getNeo4jMetadata(connection);
                    console.log('Neo4j MetaData is:', schema)
                    break;
                case 'postgres':
                    connection = await configurePostgresConnection(dbConfig);
                    schema = await getPostgresSchema(connection);
                    console.log('Postgres Schema is:', schema)
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
 * Initializes Polybase with user config and starts necessary services
 * @param {Object} config - User's configuration object
 * @returns Initialized Polybase instance
 */
async function initPolybase(config) {

    const interfaces = await configureDatabaseConnections(config);
    if (!interfaces) {
        throw handleError('Failed to initialize database connections', 500);
    }

    PolyBaseInstance.init(interfaces); // Initialize Polybase with interfaces

    logInfo('✔ Polybase initialized with configured interfaces.', { interfaces });
    console.log('✔ Polybase initialized with configured interfaces:', Object.keys(interfaces)); // Log interfaces to console

    //after successful initialization, start the CLI
    cliInterface();

    return PolyBaseInstance;
}

/**
 * Starts Polybase with the given config
 * @param {Object} config - User's configuration object (optional)
 */
async function startPolybase(config = null) {
    const finalConfig = getConfig(config);
    if (!validateConfig(finalConfig)) {
        return handleError('Invalid configuration. Initialization aborted.', 400); // Handle bad config
    }

    const polybase = await initPolybase(finalConfig);
    if (!polybase) {
        return handleError('Failed to start Polybase.', 500);
    }
}


module.exports = { initPolybase, startPolybase };
