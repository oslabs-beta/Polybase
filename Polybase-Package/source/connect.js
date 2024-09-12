const { initPolybase } = require('./presentation/init');

/**
 * Polybase module exposing the `connect` method.
 */
const Polybase = {
    /**
     * Connect to Polybase with the given config
     * Init database and starts CLI
     * @param {Object} config - The config object containing database connection det.
     */
    async connect(config) {
        try {
            console.log('Initializing Polybase...');
            await initPolybase(config);  //use the config to initialize Polybase
        } catch (error) {
            console.error('Error initializing Polybase:', error.message);
        }
    }
};

module.exports = Polybase;
