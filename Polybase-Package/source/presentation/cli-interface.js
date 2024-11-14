/*

- Manages user interaction via the Polybase Command-Line Interface (CLI).
- Routes user commands to database query handlers.
- Validates input and processes requests, returning responses or errors.
- Fetches database schemas and handles various database operations (MongoDB, PostgreSQL, Redis, Neo4j, InfluxDB).
- Logs information about the commands and any errors encountered.

*/

// const { execQuery } = require('../presentation/db-interface');
// const { validateInput, generateErrorResponse } = require('../service-utils/error-handling');
// const { logInfo, logError } = require('../service-utils/logging');
// const { getInfluxMeasurements, getMongoSchema, getPostgresSchema, getNeo4jMetadata, getRedisKeyspace } = require('../service-utils/schema-generator');
// const { handleError } = require('../service-utils/error-handling');
// const { getState } = require('../service-utils/state-utils');
// const { displayStatus, displayHelp, displayConnections } = require('../service-utils/support-commands');


// async function cliInterface() {
//     const rl = require('readline').createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     function promptUser() {

//         rl.question('$Polybase: ', async (command) => {
//             try {
//                 if (command.trim() === 'help') {
//                     displayHelp();
//                 } else if (command.trim() === 'status') {
//                     const status = await displayStatus();
//                     console.log(status);
//                 } else if (command.trim() === 'clear') {
//                     console.clear();
//                 } else if (command.trim() === 'configs') {
//                     const connections = await displayConnections();
//                     console.log(connections);
//                 } else if (command.trim() === 'retry') {
//                     console.log('Retry command detected.');

//                     const config = getCurrentConfig(); // Fetch the current configuration
//                     console.log('Current config:', config);

//                     console.log('Reattempting database connections...');
//                     try {
//                         const interfaces = await configureDatabaseConnections(config); // Reattempt connections
//                         console.log('Reattempt completed:', interfaces);

//                         // Reinitialize PolyBaseInstance with the new connections
//                         PolyBaseInstance.init(interfaces);
//                         console.log('PolyBaseInstance reinitialized.');
//                     } catch (error) {
//                         console.error('Error during retrying connections:', error);
//                     }

//                     console.log('Fetching updated configurations...');
//                     const updatedConnections = await displayConnections(); // Automatically fetch updated connections
//                     console.log('Updated configurations:', updatedConnections);
//                 } else {
//                     logInfo('Processing user command...', { command }, false);
//                     const request = parseCommand(command);
//                     const response = await handleClientRequest(request);
//                     logInfo('CLI command executed', { request, response }, false);
//                     console.log(response);
//                 }
//             } catch (error) {
//                 const errorResponse = handleError(`CLI error occurred: ${error.message}`, 500);
//             }
//             promptUser();
//         });
//     }

//     console.log('$Polybase: Polybase initialized successfully.');

//     promptUser();

//     rl.on('close', () => {
//         logInfo('CLI closed. Exiting program.', {}, true);
//         process.exit(0);
//     });
// }


// async function handleClientRequest(request) {
//     if (!validateInput(request)) {
//         return handleError('Invalid request format', 400);
//     }

//     console.log('')
//     const { dbType, query } = request;
//     console.log('dbType is', dbType, 'query is', query.operation);


//     if (query.operation === 'schema') {
//         let schema;
//         try {
//             const state = getState(dbType);
//             const connection = state.connection;

//             if (!connection) {
//                 throw new Error(`No connection found for ${dbType}`);
//             }
//             switch (dbType) {
//                 case 'mongo':
//                     schema = await getMongoSchema(connection);
//                     break;
//                 case 'postgres':
//                     schema = await getPostgresSchema(connection);
//                     break;
//                 case 'redis':
//                     schema = await getRedisKeyspace(connection);
//                     break;
//                 case 'neo4j':
//                     schema = await getNeo4jMetadata(connection);
//                     break;
//                 case 'influx':
//                     schema = await getInfluxMeasurements(connection, state.bucket, state.org);
//                     break;
//                 default:
//                     return generateErrorResponse(`Unsupported database type: ${dbType}`);
//             }
//             return schema;
//         }
//         catch (error) {
//             logError(`Unable to retrieve schema for ${dbType} database`, { error });
//             return generateErrorResponse(`Unable to retrieve schema for ${dbType} database`, 500);
//         }
//     }

//     return await execQuery(request.dbType, request.query);
// }

// function parseCommand(command) {
//     const [dbType, operation, ...params] = command.split(' ');
//     return { dbType, query: { operation, params } };
// }


// module.exports = { cliInterface, handleClientRequest, parseCommand };


const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execQuery } = require('../presentation/db-interface');
const {
    validateInput,
    generateErrorResponse,
    handleError
} = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');
const {
    getInfluxMeasurements,
    getMongoSchema,
    getPostgresSchema,
    getNeo4jMetadata,
    getRedisKeyspace
} = require('../service-utils/schema-generator');
const { getState } = require('../service-utils/state-utils');
const { configureDatabaseConnections } = require('../service-utils/db-connections');
const PolyBaseInstance = require('./polybase-instance');

// Fetches the current configuration, explicitly checking for "Polybase-Config.json"
function getCurrentConfig() {
    const configPath = path.resolve(process.cwd(), 'Polybase-Config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file "Polybase-Config.json" not found. Please ensure it exists in the working directory.`);
    }
    try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(configContent);
    } catch (error) {
        throw new Error('Failed to parse configuration file "Polybase-Config.json". Ensure it is valid JSON.');
    }
}

// Displays a welcome message when Polybase starts
function displayWelcomeMessage() {
    console.log(`
======================================================
     Welcome to Polybase CLI - Your DB Integration Tool
======================================================
Type "help" to see available commands or "configs" 
to view the current state of your database connections.
`);
}

// Displays help information
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
    const allDatabases = ['mongo', 'postgres', 'redis', 'neo4j', 'influx']; // Define all supported databases

    try {
        const configState = getState('all') || {}; // Fetch state for all databases or use an empty object

        const statusDetails = allDatabases.map((dbType) => {
            const state = configState[dbType] || {}; // Get the state for each database type or default to empty
            const connectionStatus = state.connection ? 'Connected' : 'Not Connected';
            const configSummary = state.config
                ? Object.entries(state.config)
                    .map(([key, value]) => `    - ${key}: ${value}`)
                    .join('\n')
                : '    - No Configuration Available';

            return `
${dbType.toUpperCase()}:
    - Status: ${connectionStatus}
${configSummary}
            `;
        });

        return `
======================================================
             Current Database Setup
======================================================
${statusDetails.join('\n')}
        `;
    } catch (error) {
        logError('Error displaying status', { error });
        return `
======================================================
             Current Database Setup
======================================================
- Status Retrieval Failed:
    - Error: ${error.message}
        `;
    }
}

// Displays a summary of database connections
async function displayConnections() {
    const databases = ['mongo', 'postgres', 'redis', 'neo4j', 'influx'];
    let statusSummary = [];

    for (const dbType of databases) {
        try {
            const state = getState(dbType);
            const connection = state.connection;

            if (connection) {
                statusSummary.push(`${dbType.toUpperCase()}: Connection successful`);
            } else {
                statusSummary.push(`${dbType.toUpperCase()}: Configuration failed or no connection found`);
            }
        } catch (error) {
            statusSummary.push(`${dbType.toUpperCase()}: Error checking status - ${error.message}`);
        }
    }

    return statusSummary.join('\n');
}

// Main CLI interface
async function cliInterface() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Handles commands entered by the user
    async function handleCommand(command) {
        const trimmedCommand = command.trim();
        try {
            switch (trimmedCommand) {
                case 'help':
                    displayHelp();
                    break;

                case 'status':
                    const status = await displayStatus();
                    console.log(status); // Directly log the message
                    break;

                case 'configs':
                    const connections = await displayConnections();
                    console.log(connections);
                    break;

                case 'retry':
                    await handleRetryCommand();
                    break;

                case 'clear':
                    process.stdout.write('\u001b[3J\u001b[2J\u001b[0;0H'); // Clear buffer, screen, and reset cursor
                    console.log('Polybase CLI screen cleared.');
                    break;

                default:
                    await handleCustomCommand(trimmedCommand);
            }
        } catch (error) {
            logError(`CLI error occurred: ${error.message}`, { error });
            console.error('Error:', error.message);
        }
    }

    // Handles the `retry` command
    async function handleRetryCommand() {
        console.log('Retrying failed connections...');
        try {
            const config = getCurrentConfig(); // Fetch the current configuration
            console.log('Current config:', config);

            const interfaces = await configureDatabaseConnections(config); // Avoid circular dependency
            PolyBaseInstance.init(interfaces);
            console.log('Reattempt completed. Updated connections:');
            const updatedConnections = await displayConnections();
            console.log(updatedConnections);
        } catch (error) {
            logError('Error during retry process', { error });
            console.error('Retry failed:', error.message);
        }
    }

    // Recursive function to prompt user for input
    function startPrompt() {
        rl.question('$Polybase: ', async (command) => {
            await handleCommand(command);
            startPrompt(); // Restart the prompt after command is handled
        });
    }

    // Display the welcome message
    displayWelcomeMessage();

    console.log('$Polybase: Polybase CLI initialized successfully.');
    startPrompt();

    rl.on('close', () => {
        logInfo('CLI closed. Exiting program.', {}, true);
        process.exit(0);
    });
}

module.exports = { cliInterface, getCurrentConfig };