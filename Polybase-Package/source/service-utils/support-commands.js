/**
 * support-commands.js
 * 
 * Additinoal 'helper' methods for user to call for instructions
 */

const { getState } = require('./state-utils');
const { logError, logInfo } = require('./logging');
const { handleError } = require('./error-handling');
const { getConfig } = require('./config-management');

function displayHelp() {
    console.log(`
    Available Commands:
    - MongoDB: mongo [operation] [collectionName] [query/params]
    - Postgres: postgres [operation] [tableName] [condition/fields/params]
    - Redis: redis [operation] [key] [value/params]
    - InfluxDB: influx [operation] [measurement] [tag/fields/params]
    - Neo4j: neo4j [operation] [label] [whereClause/params]

    Operations:
    - find, insert, update, delete (for most databases)
    - For influx: 'query' or 'write'

    Example Commands:
    - MongoDB: mongo find users {"age": {"$gte": 25}}
    - Postgres: postgres select users age > 25
    - InfluxDB: influx query temperature station_id=1234
    `);
}


async function displayStatus() {

    const config = getConfig();
    console.log(config);
    try {
        const configState = getState('all');
        let statusMessage = 'Current Database Setup:\n';
        for (const [dbType, state] of Object.entries(configState)) {
            const { connection, config } = state;
            const isConnected = connection ? 'Connected' : 'Not Connected';
            statusMessage += `
            - ${dbType.toUpperCase()}:
                - URL: ${config.url || config.host || 'N/A'}
                - Status: ${isConnected}
            `;
        }
        return statusMessage;
    } catch (error) {
        logError('Error displaying status', { error });
        return handleError(`Failed to retrieve status: ${error.message}`, 500);
    }
}

module.exports = { displayHelp, displayStatus };
