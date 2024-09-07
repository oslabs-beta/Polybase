const { execQuery } = require('../presentation/db-interface');
const { validateInput, generateErrorResponse } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');

/**
 * Manages I/O interface for user queries after
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
                //log out user details (only to file)
                logInfo('Processing user command...', { command }, false);  

                const request = parseCommand(command);
                const response = await handleClientRequest(request);

                //display results
                console.log(response);

                //lot out details of the response 
                logInfo('CLI command executed', { request, response }, false);
            } catch (error) {
                const errorResponse = handleError(`CLI error occurred: ${error.message}`, 500);
                console.error(errorResponse.error.message);
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
