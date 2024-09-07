/**
 * init.js
 * 
 * Responsible for initializing the Polybase environment
 * Sets up the necessary configurations, establishing connections to the specified databases.
 */

const { configureMongoDBConnection, configureRedisConnection, configurePostgresConnection } = require('../service-utils/connection-pool');
const { cliInterface } = require('./cli-interface');
const { getConfig, validateConfig } = require('../service-utils/config-management');
const { manageState } = require('../service-utils/state-utils');
const { handleError } = require('../service-utils/error-handling');
const { logInfo } = require('../service-utils/logging');

/** 
 * manages initialization and state of polybase 
 * (connections, configurations, etc.)
 */
const PolyBaseInstance = {
    interfaces: {}, // stores db interfaces connected in session

    // initializes polybase with provided interfaces
    init(interfaces) {
        this.interfaces = interfaces;
        logInfo('polybase instance initialized with interfaces', { interfaces });
    },

    // retrieves interface for a specific db type
    getInterface(dbType) {
        return this.interfaces[dbType];
    }
};

/**
 * establishes connections for each database in user config
 * @param {Object} config user's config object (dbs to manage)
 * @returns interfaces for connected dbs
 */
async function configureDatabaseConnections(config) {
    const interfaces = {};
    for (const [dbType, dbConfig] of Object.entries(config)) {
        try {
            let connection;
            switch (dbType) {
                case 'mongo':
                    connection = await configureMongoDBConnection(dbConfig);  
                    break;
                case 'redis':
                    connection = await configureRedisConnection(dbConfig);  
                    break;
                case 'influxdb':
                    connection = {}; // placeholder for influx
                    break;
                case 'postgres':
                    connection = await configurePostgresConnection(dbConfig);  
                    break;
                default:
                    throw new Error(`unsupported database type: ${dbType}`);
            }
            interfaces[dbType] = connection; // store connection
            manageState(dbType, connection, dbConfig); // manage state (each db connection has a slice)
        } catch (error) {
            logError(`failed to connect to ${dbType}`, { error });
            return handleError(`failed to connect to ${dbType}: ${error.message}`, 500);
        }
    }
    return interfaces;
}

/**
 * initializes polybase with user config
 * @param {Object} config user's config object (dbs to manage)
 * @returns initialized polybase instance
 */
async function initPolybase(config) {
    logInfo('...initializing polybase...', {}, true); // show in console
    const interfaces = await configureDatabaseConnections(config);

    if (!interfaces) {
        throw handleError('failed to initialize database connections', 500);
    }

    PolyBaseInstance.init(interfaces); // init polybase with interfaces
    logInfo('✔ polybase initialized with all configured interfaces.', { interfaces }, false);
    console.log('polybase initialized successfully with interfaces:', interfaces); // Log interfaces to console
    return PolyBaseInstance;
}

/**
 * starts polybase with the given config
 * @param {Object} config user's config object (optional)
 */
async function startPolybase(config = null) {
    const finalConfig = getConfig(config);
    if (!validateConfig(finalConfig)) {
        return handleError('invalid configuration. initialization aborted.', 400); // handle bad config
    }

    const polybase = await initPolybase(finalConfig);
    if (!polybase) {
        return handleError('failed to start polybase.', 500);
    }

    cliInterface(); //starting CLI after initialization --user able to interact with polybase
}

module.exports = { initPolybase, startPolybase };
