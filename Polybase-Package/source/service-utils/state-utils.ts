/**
 * state-manager.ts
 * 
 * Manages **dynamic** state of Polybase system like active connections,
 * ongoing transactions, and any other run-time data needed. 
 * 
 * Serves as a central store that can be accessed & 
 * modified by modules within Polybase.
 * 
 * Refining Tasks:
 * - Tracks current state of database connections and configurations.
 * - Provides methods for adding, retrieving, and updating state info that other modules
 *   can use.
 * - Handles state-related errors.
 * - Ensures consistency & stability across all components.
 */

import { logInfo, logError, safeStringify } from './logging';

// Define types for database connections and configurations
interface Connection {
    // Define the shape of a connection (this can be updated to be more specific)
    [key: string]: any;
}

interface Config {
    // Define the shape of a configuration (this can be updated to be more specific)
    [key: string]: any;
}

interface State {
    connections: { [dbType: string]: Connection };
    configs: { [dbType: string]: Config };
}

interface StateManager {
    state: State;
    addConnection(dbType: string, connection: Connection): void;
    getConnection(dbType: string): Connection | undefined;
    setConfig(dbType: string, config: Config): void;
    getConfig(dbType: string): Config | undefined;
    handleStateError(dbType: string, error: Error): void;
}

const stateManager: StateManager = {
    state: {
        connections: {},
        configs: {}
    },

    // Adds a new database connection
    addConnection(dbType: string, connection: Connection): void {
        this.state.connections[dbType] = connection;
        logInfo(`Added connection for ${dbType}`, { dbType, connectionDetails: safeStringify(connection, 2) });
    },

    // Retrieves a connection for the given database type
    getConnection(dbType: string): Connection | undefined {
        return this.state.connections[dbType];
    },

    // Sets a configuration for the given database type
    setConfig(dbType: string, config: Config): void {
        this.state.configs[dbType] = config;
        logInfo(`Set config for ${dbType}`, { config });
    },

    // Retrieves a configuration for the given database type
    getConfig(dbType: string): Config | undefined {
        return this.state.configs[dbType];
    },

    // Handles state-related errors
    handleStateError(dbType: string, error: Error): void {
        logError(`State error for ${dbType}`, { error: safeStringify(error, 2) });
    }
};

/**
 * Managing different parts of state (dynamic info)
 * @param {string} dbType - The type of database related to
 * @param {Connection} connection - The status of the connection
 * @param {Config} config - The configuration
 */
function manageState(dbType: string, connection: Connection, config: Config): void {
    try {
        stateManager.addConnection(dbType, connection);
        stateManager.setConfig(dbType, config);
    } catch (error) {
        stateManager.handleStateError(dbType, error as Error);
        throw new Error(`Failed to manage state for ${dbType}: ${(error as Error).message}`);
    }
}

/**
 * Retrieves the state for a specific database type
 * @param {string} dbType - The type of the database
 * @returns {{ connection: Connection | undefined, config: Config | undefined }}
 */
function getState(dbType: string): { connection: Connection | undefined, config: Config | undefined } {
    try {
        return {
            connection: stateManager.getConnection(dbType),
            config: stateManager.getConfig(dbType)
        };
    } catch (error) {
        stateManager.handleStateError(dbType, error as Error);
        throw new Error(`Failed to retrieve state for ${dbType}: ${(error as Error).message}`);
    }
}

/**
 * Connection error handling
 * @param {string} dbType - The type of the database
 */
function handleConnectionDrop(dbType: string): void {
    try {
        const state = getState(dbType);
        stateManager.handleStateError(dbType, new Error('Connection dropped'));
        // Need to add recovery logic
    } catch (error) {
        stateManager.handleStateError(dbType, error as Error);
        throw new Error(`Failed to handle connection drop for ${dbType}: ${(error as Error).message}`);
    }
}

export { stateManager, manageState, getState, handleConnectionDrop };
