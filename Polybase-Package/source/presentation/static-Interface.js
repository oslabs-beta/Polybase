/*

 - Simulates a CLI query execution within the IDE.
 - Supports multiple database types: MongoDB, Redis, PostgreSQL.
 - Translates input arguments into a Polybase CLI command.
 - Handles different database-specific query formats (e.g., filters for MongoDB, Redis keys).
 - Uses `parseCommand` to convert query strings into actionable commands.
 - Sends parsed command to `handleClientRequest` for execution.
 - Returns the result of the query as a promise.

 */


const { parseCommand, handleClientRequest } = require('./cli-interface');

async function find(dbType, collectionName, filter, projection) {
    let command = '';

    switch (dbType) {

        case 'mongo':
            const mongoFilterString = Object.entries(filter)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            command = `${dbType} find ${collectionName} ${mongoFilterString} ${projection}`;
            break;

        case 'redis':
            if (typeof filter !== 'string') {
                throw new Error("For Redis, 'filter' must be a string key (e.g., 'sample_bicycle:1001').");
            }
            command = `${dbType} json.get ${filter}`;
            break;

        case 'postgres':
            const postgresFilterString = Object.entries(filter)
                .map(([key, value]) => `${key}=${value}`)
                .join(' ');
            command = `${dbType} select ${collectionName} ${postgresFilterString} ${projection}`;
            break;

        default:
            throw new Error(`Unsupported database type: ${dbType}`);
    }

    const request = parseCommand(command);

    const response = await handleClientRequest(request);

    return response;
}

module.exports = { find };
