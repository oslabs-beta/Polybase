/* 

- Defines a module to handle Polybase connections.
- Connects to Polybase using provided configuration settings.
- Initializes the database and starts the command-line interface.
- Logs success or error messages during initialization.
- Exports the Polybase module for external use.

TLDR: This file initializes and connects Polybase using a provided configuration, starting the database and CLI.

*/

const { initPolybase } = require('./presentation/init');

const Polybase = {

    async connect(config) {
        try {
            console.log('Initializing Polybase...');
            await initPolybase(config);
        } catch (error) {
            console.error('Error initializing Polybase:', error.message);
        }
    }
};

module.exports = Polybase;