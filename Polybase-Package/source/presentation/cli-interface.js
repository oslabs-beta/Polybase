const { execQuery } = require('../presentation/db-interface');
const { validateInput, generateErrorResponse } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');
const { getInfluxMeasurements, getMongoSchema, getPostgresSchema, getNeo4jMetadata, getRedisKeyspace } = require('../service-utils/schema-generator');
const { handleError } = require('../service-utils/error-handling');
const { getState } = require('../service-utils/state-utils');
const { displayStatus, displayHelp } = require('../service-utils/support-commands');
/**
 * manages I/O interface for user queries after
 * polybase initialized
 */
async function cliInterface() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function promptUser() {
        //show $Polybase prompt and wait for input
        rl.question('$Polybase: ', async (command) => {
            try {
                if (command.trim() === 'help') {
                    displayHelp();
                } else if (command.trim() === 'status') {
                    const status = await displayStatus();
                    console.log(status);
                } else {
                    //log out user details (only to file)
                    logInfo('Processing user command...', { command }, false);
                    const request = parseCommand(command);
                    const response = await handleClientRequest(request);
                    logInfo('CLI command executed', { request, response }, false);

                    // //display results
                    console.log(response);
                }
                //lot out details of the response 
            } catch (error) {
                const errorResponse = handleError(`CLI error occurred: ${error.message}`, 500);
                // console.error(errorResponse.error.message);
            }
            //show $polybase CLI again
            promptUser();
        });
    }

    //Separator between I/o
    console.log('$Polybase: Polybase initialized successfully.');


    promptUser();

    rl.on('close', () => {
        logInfo('CLI closed. Exiting program.', {}, true);
        process.exit(0);
    });
}



/**
 * Routes 
 * @param {*} request 
 * @returns 
 */
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
            const state = getState(dbType); // Get the connection object from state manager
            const connection = state.connection; // Extract the connection instance

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

    //SHOULD ADD OTHER ONES:
    //if not schema request, check other:
    return await execQuery(request.dbType, request.query);
}

/**
 * Converts CLI-command to object
 * @param {String} command raw user input
 * @returns nested Object representing the components of the command
 */
function parseCommand(command) {
    const [dbType, operation, ...params] = command.split(' ');
    return { dbType, query: { operation, params } };
}

// cliInterface();

module.exports = { cliInterface, handleClientRequest };
