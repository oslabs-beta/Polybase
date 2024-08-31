const { execQuery } = require('../presentation/db-interface');
const { validateInput, generateErrorResponse } = require('../service-utils/error-handling');

/**
 * Manages I/O interface for user queries after
 * polybase initialized
 */
async function cliInterface() {
    //create new I/O interface piped to readLine stream
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    /**
     * Continuously re-prompt user via CLI
     * after they've made new instance of Polybase
     * and succesfully connected database
     */
    function promptUser() {
        
        //block and wait for user CLI query
        rl.question('$Polybase: ', async (command) => {
            //tokenize command string to object and init handling
            try {
                const request = parseCommand(command);
                const response = await handleClientRequest(request);
                console.log(response);
            } catch (error) {
                console.error('promptUser() error occurred:', error.message);
            }
            //reprompt
            promptUser();
        });
    }

    promptUser();

    //when close signal received from CLI, stop execution
    rl.on('close', () => {
        console.log('CLI closed. Exiting program.');
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
        return generateErrorResponse('Invalid request format', 400);
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
