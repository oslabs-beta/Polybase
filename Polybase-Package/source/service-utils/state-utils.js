/*

 - Manages dynamic state of the Polybase system (e.g., connections, transactions).
 - Serves as a centralized store accessible and modifiable by various modules.
 - Tracks the current state of database connections and configurations.
 - Provides methods for adding, retrieving, and updating state information.
 - Handles state-related errors, ensuring consistency and stability across components.
 - Includes error handling for connection drops and state management failures.
 - Logs state changes and errors for debugging and tracking purposes.

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

function handleConnectionDrop(dbType) {
    try {
        const state = getState(dbType);
        stateManager.handleStateError(dbType, new Error('Connection dropped'));
    } catch (error) {
        stateManager.handleStateError(dbType, error);
        throw new Error(`Failed to handle connection drop for ${dbType}: ${error.message}`);
    }
}

module.exports = { stateManager, manageState, getState, handleConnectionDrop };
