/**
 * init.ts
 * 
 * Responsible for initializing the Polybase environment
 * Sets up the necessary configurations, establishing connections to the specified databases.
 */
import { 
    configureMongoConnection, 
    configureRedisConnection, 
    configurePostgresConnection, 
    configureNeo4jConnection, 
    configureInfluxConnection 
} from '../service-utils/connection-pool';
import { cliInterface } from './cli-interface';
import { getConfig, validateConfig } from '../service-utils/config-management';
import { manageState } from '../service-utils/state-utils';
import { handleError } from '../service-utils/error-handling';
import { logInfo, logError } from '../service-utils/logging';
import fs from 'fs';
import path from 'path';

// Define general config interface for each database type
interface DatabaseConfig {
    [dbType: string]: any; // Change 'any' to a more specific type if possible
}

interface PolyBaseInstance {
    interfaces: { [dbType: string]: any };
    init: (interfaces: { [dbType: string]: any }) => void;
    getInterface: (dbType: string) => any;
}

// Create PolyBase instance with types
const PolyBaseInstance: PolyBaseInstance = {
    interfaces: {}, // stores db interfaces connected in session

    // initializes Polybase with provided interfaces
    init(interfaces: { [dbType: string]: any }) {
        this.interfaces = interfaces;
        logInfo('Polybase instance initialized with interfaces', { interfaces });
    },

    // retrieves interface for a specific db type
    getInterface(dbType: string) {
        return this.interfaces[dbType];
    }
};

/**
 * Establish connections for each database in user config
 * @param {DatabaseConfig} config - User's configuration object (databases to manage)
 * @returns interfaces for connected databases
 */
async function configureDatabaseConnections(config: DatabaseConfig): Promise<{ [dbType: string]: any }> {
    const interfaces: { [dbType: string]: any } = {};
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
 * Initialize Polybase with user config and starts necessary services
 * @param {DatabaseConfig} config - User's configuration object
 * @returns Initialized Polybase instance
 */
async function initPolybase(config: DatabaseConfig): Promise<PolyBaseInstance> {
    const interfaces = await configureDatabaseConnections(config);
    if (!interfaces) {
        throw handleError('Failed to initialize database connections', 500);
    }

    PolyBaseInstance.init(interfaces); // init Polybase with interfaces

    logInfo('✔ Polybase initialized with configured interfaces.', { interfaces });
    console.log('✔ Polybase initialized with configured interfaces:', Object.keys(interfaces)); // Log interfaces to console

    // After successful initialization, start the CLI
    cliInterface();

    return PolyBaseInstance;
}

/**
 * Starts Polybase with the given config
 * @param {string | DatabaseConfig} config - User's configuration object
 */
async function startPolybase(config: string | DatabaseConfig | null = null): Promise<void> {
    let finalConfig: DatabaseConfig;

    // if config is a string, like a file path, load JSON 
    if (typeof config === 'string') {
        const configFilePath = path.resolve(process.cwd(), config);
        if (fs.existsSync(configFilePath)) {
            const fileContent = fs.readFileSync(configFilePath, 'utf-8');
            finalConfig = JSON.parse(fileContent); // Parse the JSON config file
            console.log('Configuration loaded from file:', configFilePath);
        } else {
             handleError('Configuration file not found.', 400);
        }
    } 
    // if config object, use it directly
    else if (typeof config === 'object' && config !== null) {
        finalConfig = config;
        console.log('Configuration object provided directly.');
    } 
    // if no valid config, log
    else {
         handleError('No valid configuration provided.', 400);
    }

    // Validate config file
    if (!validateConfig(finalConfig)) {
         handleError('Invalid configuration. Initialization aborted.', 400); // Handle bad config
    }

    // Init Polybase with final validated config (doesn't mean will connect)
    const polybase = await initPolybase(finalConfig);
    if (!polybase) {
         handleError('Failed to start Polybase.', 500);
    }
}

export { initPolybase, startPolybase, configureDatabaseConnections };
