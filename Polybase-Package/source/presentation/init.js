/**
 * init.js
 * 
 * Responsible for initializing the Polybase environment
 * Sets up the necessary configurations, establishing connections to the specified databases.
 */

const { configureMongoDBConnection, configureRedisConnection, configurePostgresConnection } = require('../service-utils/connection-pool');
const { cliInterface } = require('./cli-interface');
const { manageState } = require('../service-utils/state-utils');

/**
 * Object holding the instance of Polybase 
 * that user initialized (vina JS script)
 */
const PolyBaseInstance = {
    interfaces: {},

    init(interfaces) {
        this.interfaces = interfaces;
    },

    getInterface(dbType) {
        return this.interfaces[dbType];
    }
};

/**
 * Begings routing each database in the configuration
 * object to its respective connection method
 * 
 * @param {Object} config The initial Object 'user' passes that details 
 * the databases they want to want Polybase to manage
 *  @returns The interfaces to be initialized on this Polybase instance 
 */
async function configureDatabaseConnections(config) {
    const interfaces = {};

    //parse each database type and send its confinguration details to connector
    for (const [dbType, dbConfig] of Object.entries(config)) {
    
        try {
            let connection;
            switch (dbType) {
                case 'mongo':
                    connection = await configureMongoDBConnection(dbConfig);  // Mocked MongoDB connection
                    break;
                case 'redis':
                    connection = await configureRedisConnection(dbConfig);  // Mocked Redis connection
                    break;
                case 'influxdb':
                    connection = {};  // Placeholder for InfluxDB interface
                    break;
                case 'postgres':
                    connection = await configurePostgresConnection(dbConfig);  // Mocked PostgreSQL connection
                    break;
                default:
                    throw new Error(`Unsupported database type: ${dbType}`);
            }

            //add database type with its connection as key -value to co
            interfaces[dbType] = connection;

            //
            manageState(dbType, connection, dbConfig); 
        } catch (error) {
            console.error(`Failed to connect to ${dbType}:`, error);
            return null;
        }
    }

    return interfaces;
}

/**
 * An asynchronous function to configure the database instance
 * in this execution of Polybase
 * 
 * @param {Object} config The initial Object 'user' passes that details 
 * the databases they want to want Polybase to manage
 * @returns Succesfully configured instance of Polybase with required 
 * interfaces
 */
async function initPolybase(config) {
    //Convert singular configuration object to Polybase instances
    const interfaces = await configureDatabaseConnections(config);
   
    //catch any uncaught errors during configuration
    if (!interfaces) {
        throw new Error('Failed to initialize database connections');
    }

    //initialize property 'interfaces' on Polybase instance (setting this.interfaces)
    PolyBaseInstance.init(interfaces);
    return PolyBaseInstance;
}

/**
 * An asynchronous entry point for package -- when Polybase installed
 * and run (via some variant of PolyBase.connect())
 * 
 * @param {Object} config The initial Object 'user' passes that details 
 * the databases they want to want Polybase to manage
 * @returns 
 */
async function startPolybase(config) {

    //Begins process of creating an instance of Polybase 
    const polybase = await initPolybase(config);

    //catch error trying to create these interfaces
    if (!polybase) {
        console.error('Failed to start Polybase');
        return;
    }

    //Enable command-line interaction for succesful Polybase instances
    cliInterface();
}

module.exports = { initPolybase, startPolybase };
