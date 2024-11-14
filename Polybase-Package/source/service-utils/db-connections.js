const {
    configureMongoConnection,
    configureRedisConnection,
    configurePostgresConnection,
    configureNeo4jConnection,
    configureInfluxConnection
} = require('../service-utils/connection-pool');
const { manageState } = require('../service-utils/state-utils');
const { logInfo, logError } = require('../service-utils/logging');

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
            logInfo(`✔ Connection to ${dbType} established.`);
        } catch (error) {
            logError(`Failed to connect to ${dbType}: ${error.message}`, { error });
        }
    }

    return interfaces;
}

module.exports = { configureDatabaseConnections };