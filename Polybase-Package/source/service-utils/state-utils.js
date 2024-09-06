/**
 * state-manager.js
 * 
 * manges **dyanmic** state of Polybase system like active connections,
 * ongoing transactions, any other run-time data we need. 
 * 
 * Servers as a centralz store that can be accessed & 
 * modified by modules within the Polybase
 * 
 * Refining Tasks
 * - tracks current state of database connections and configurations.
 * - provide methods for adding, retrieving, and updating state info that other modules
 *  can use.
 * - handle state-related errors
 * - ensuring there is consistency & stability across all components.
 */


const { logInfo, logError, safeStringify } = require('./logging');

const stateManager = {
    state: {
        connections: {},
        configs: {}
    },

    addConnection(dbType, connection) {
        this.state.connections[dbType] = connection;
        logInfo(`Added connection for ${dbType}`, { dbType, connectionDetails: safeStringify(connection, 2) });
    },

    getConnection(dbType) {
        return this.state.connections[dbType];
    },

    setConfig(dbType, config) {
        this.state.configs[dbType] = config;
        logInfo(`Set config for ${dbType}`, { config });
    },

    getConfig(dbType) {
        return this.state.configs[dbType];
    },

    handleStateError(dbType, error) {
        logError(`State error for ${dbType}`, { error: safeStringify(error, 2) });
    }
};

/**
 * Managing different parts of state (dynamic info)
 * @param {*} dbType the type of database related to
 * @param {*} connection the status of the connection
 * @param {*} config the configuration
 */
function manageState(dbType, connection, config) {
    try {
        stateManager.addConnection(dbType, connection);
        stateManager.setConfig(dbType, config);
    } catch (error) {
        stateManager.handleStateError(dbType, error);
        throw new Error(`Failed to manage state for ${dbType}: ${error.message}`);
    }
}

function getState(dbType) {
    try {
        return {
            connection: stateManager.getConnection(dbType),
            config: stateManager.getConfig(dbType)
        };
    } catch (error) {
        stateManager.handleStateError(dbType, error);
        throw new Error(`Failed to retrieve state for ${dbType}: ${error.message}`);
    }
}
/**
 * Connection error handling
 * @param {*} dbType 
 */
function handleConnectionDrop(dbType) {
    try {
        const state = getState(dbType);
        stateManager.handleStateError(dbType, new Error('Connection dropped'));
        //need to add recovery logic
    } catch (error) {
        stateManager.handleStateError(dbType, error);
        throw new Error(`Failed to handle connection drop for ${dbType}: ${error.message}`);
    }
}

module.exports = { stateManager, manageState, getState, handleConnectionDrop };
