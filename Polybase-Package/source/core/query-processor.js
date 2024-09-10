/**
 * query-processor.js
 * 
 * handles the processing and validation of database queries.
 * Breaks down queries into components, validates them, and preps them for 
 * execution in the corresponding adapter in the transformation layer.
 */

const { getState } = require('../service-utils/state-utils');

/**
 * Validates the query based on the connected databases in state manager
 * @param {String} dbType - The database type (e.g., mongo, redis, postgres, influxdb)
 * @param {String} operation - The requested database operation
 * @param {Object} params - Parameters provided with the query (e.g., collection name, SQL conditions)
 * @returns {Boolean} - Whether the query valid or not
 */
function validateQuery(dbType, operation, params) {
    const state = getState(dbType);
    const connection = state.connection;
    const validOperations = ['find', 'get', 'select', 'query', 'json.get'];

    //checking if the dbtype is one of the dbs that is currently connected
    if (!connection) {
        console.log(`Invalid dbType: ${dbType}. No active connection found.`);
        return false;
    }

    if (!validOperations.includes(operation)) {
        console.log(`Invalid operation: ${operation}. Expected one of: ${validOperations.join(', ')}`);
        return false;
    }

    if (!params || typeof params !== 'object') {
        console.log(`Invalid parameters: ${params}. Expected a valid object with query details.`);
        return false;
    }

    console.log('Query validation successful.');
    return true;
}

/**
 * Receives a parsed query from the presentation layer and initializes an execution
 * plan for the query based on requirements. Also validates the query against the
 * connected databases in state.
 * @param {String} dbType - The database type (e.g., mongo, postgres).
 * @param {Object} query - The query object containing the operation and params.
 * @returns {Object} - Clearly partitioned execution plan or validation error message.
 */
function processQuery(dbType, query) {
    // console.log('src/core/query-processor | running processQuery with:', { dbType, query });

    //validate query format
    const { operation, params } = query;
    const isValid = validateQuery(dbType, operation, params);

    if (!isValid) {
        return { error: 'Query validation failed. Please ensure your query follows the standard format.' };
    }

    //sim query processing (if validation passes)
    return { executionPlan: `Plan for ${operation} on ${dbType}` };
}

module.exports = { processQuery };
