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


const stateManager = {
    state: {
        connections: {},
        configs: {}
    },

    addConnection(dbType, connection) {
        this.state.connections[dbType] = connection;
    },

    getConnection(dbType) {
        return this.state.connections[dbType];
    },

    setConfig(dbType, config) {
        this.state.configs[dbType] = config;
    },

    getConfig(dbType) {
        return this.state.configs[dbType];
    },

    handleStateError(dbType, error) {
        console.error(`State error for ${dbType}:`, error);
        //need additional error-handling -e.g. reconfig connections
    }
};

function manageState(dbType, connection, config) {
    stateManager.addConnection(dbType, connection);
    stateManager.setConfig(dbType, config);

}

function getState(dbType) {
    return {
        connection: stateManager.getConnection(dbType),
        config: stateManager.getConfig(dbType)
    };
}

function handleConnectionDrop(dbType) {
    const state = getState(dbType);
    stateManager.handleStateError(dbType, new Error('Connection dropped'));

}

module.exports = { stateManager, manageState, getState, handleConnectionDrop };
