/*

- Manages user interaction via the Polybase Command-Line Interface (CLI).
- Routes user commands to database query handlers.
- Validates input and processes requests, returning responses or errors.
- Fetches database schemas and handles various database operations (MongoDB, PostgreSQL, Redis, Neo4j, InfluxDB).
- Logs information about the commands and any errors encountered.

*/

const { execQuery } = require('../presentation/db-interface');
const { validateInput, generateErrorResponse } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');
const { getInfluxMeasurements, getMongoSchema, getPostgresSchema, getNeo4jMetadata, getRedisKeyspace } = require('../service-utils/schema-generator');
const { handleError } = require('../service-utils/error-handling');
const { getState } = require('../service-utils/state-utils');
const { displayStatus, displayHelp, displayConnections } = require('../service-utils/support-commands');


async function cliInterface() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function promptUser() {

        rl.question('$Polybase: ', async (command) => {
            try {
                if (command.trim() === 'help') {
                    displayHelp();
                } else if (command.trim() === 'status') {
                    const status = await displayStatus();
                    console.log(status);
                } else if (command.trim() === 'clear') {
                    console.clear();
                } else if (command.trim() === 'configs') {
                    const connections = await displayConnections();
                    console.log(connections);
                } else {
                    logInfo('Processing user command...', { command }, false);
                    const request = parseCommand(command);
                    const response = await handleClientRequest(request);
                    logInfo('CLI command executed', { request, response }, false);
                    console.log(response);
                }
            } catch (error) {
                const errorResponse = handleError(`CLI error occurred: ${error.message}`, 500);
            }
            promptUser();
        });
    }

    console.log('$Polybase: Polybase initialized successfully.');

    promptUser();

    rl.on('close', () => {
        logInfo('CLI closed. Exiting program.', {}, true);
        process.exit(0);
    });
}


async function handleClientRequest(request) {
    if (!validateInput(request)) {
        return handleError('Invalid request format', 400);
    }

    console.log('')
    const { dbType, query } = request;
    console.log('dbType is', dbType, 'query is', query.operation);


    if (query.operation === 'schema') {
        let schema;
        try {
            const state = getState(dbType);
            const connection = state.connection;

            if (!connection) {
                throw new Error(`No connection found for ${dbType}`);
            }
            switch (dbType) {
                case 'mongo':
                    schema = await getMongoSchema(connection);
                    break;
                case 'postgres':
                    schema = await getPostgresSchema(connection);
                    break;
                case 'redis':
                    schema = await getRedisKeyspace(connection);
                    break;
                case 'neo4j':
                    schema = await getNeo4jMetadata(connection);
                    break;
                case 'influx':
                    schema = await getInfluxMeasurements(connection, state.bucket, state.org);
                    break;
                default:
                    return generateErrorResponse(`Unsupported database type: ${dbType}`);
            }
            return schema;
        }
        catch (error) {
            logError(`Unable to retrieve schema for ${dbType} database`, { error });
            return generateErrorResponse(`Unable to retrieve schema for ${dbType} database`, 500);
        }
    }

    return await execQuery(request.dbType, request.query);
}

function parseCommand(command) {
    const [dbType, operation, ...params] = command.split(' ');
    return { dbType, query: { operation, params } };
}


module.exports = { cliInterface, handleClientRequest, parseCommand };
