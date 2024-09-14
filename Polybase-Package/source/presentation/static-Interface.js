const { parseCommand, handleClientRequest } = require('./cli-interface');

/**
 * Static find method to simulate a CLI query via the IDE
 * transates input args into a Polybase CLI command and execs it.
 *
 * @param {string} dbType - type of database (mvp - neo4j, influx mongo, postgres, redis).
 * @param {string} collectionName name of the collection (for Mongo) or table (for SQL).
 * @param {Object|string} filter fd filter query (e.g., { _id: "66dcc19369d2d12812633326" } for Mongo or "customer_id=7" for Postgres).
 * @param {string} projection  fields to project or retrieve (e.g., "name").
 * @returns {Promise<Object>} result of the query.
 */
async function find(dbType, collectionName, filter, projection) {
    let command = '';

    switch (dbType) {
        //handle mongdob
        case 'mongo':
            const mongoFilterString = Object.entries(filter)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            command = `${dbType} find ${collectionName} ${mongoFilterString} ${projection}`;
            break;

        //handle redis query -- BASIC only have json .get
        case 'redis':
            if (typeof filter !== 'string') {
                throw new Error("For Redis, 'filter' must be a string key (e.g., 'sample_bicycle:1001').");
            }
            command = `${dbType} json.get ${filter}`;
            break;

        //handle psotgres
        case 'postgres':
            const postgresFilterString = Object.entries(filter)
                .map(([key, value]) => `${key}=${value}`)
                .join(' ');
            command = `${dbType} select ${collectionName} ${postgresFilterString} ${projection}`;
            break;

        default:
            throw new Error(`Unsupported database type: ${dbType}`);
    }

    //send over to parser and central client handler
    const request = parseCommand(command);

    const response = await handleClientRequest(request);

    return response;
}

module.exports = { find };
