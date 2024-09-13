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
 * @param {String} dbType - The db type (e.g., mongo, redis, postgres, influxdb)
 * @param {String} operation - The req'd database operation
 * @param {Object} params - Parameters provided with the query (e.g., collection name, SQL conditions)
 * @returns {Boolean} - if the query valid or not
 */
function validateQuery(dbType, operation, params) {
    const state = getState(dbType);
    const connection = state.connection;
    /**
     * @TODO: Add only when tested
     */
    const validOperations = ['find', 'match', 'get', 'select', 'query', 'json.get'];

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


// EXAMPLE: 


// A mock database schema and query definitions
const supportedDatabases = {
    sql: ['PostgreSQL', 'MySQL'],
    nosql: ['MongoDB', 'CouchDB'],
    kvstore: ['Redis'],
    graph: ['Neo4j']
};

// Sample query structure example
// query = {
//   operation: 'SELECT',
//   fields: ['name', 'age'],
//   conditions: { id: 1001 },
//   databases: ['MongoDB', 'PostgreSQL']
// };

// // Function to parse the query and split it across databases
// function processQuery(query) {
//     const parsedQueries = [];

//     query.databases.forEach(db => {
//         if (supportedDatabases.sql.includes(db)) {
//             parsedQueries.push({
//                 dbType: 'sql',
//                 database: db,
//                 operation: query.operation,
//                 fields: query.fields,
//                 conditions: query.conditions
//             });
//         } else if (supportedDatabases.nosql.includes(db)) {
//             parsedQueries.push({
//                 dbType: 'nosql',
//                 database: db,
//                 operation: query.operation,
//                 fields: query.fields,
//                 conditions: query.conditions
//             });
//         } else if (supportedDatabases.kvstore.includes(db)) {
//             parsedQueries.push({
//                 dbType: 'kvstore',
//                 database: db,
//                 operation: query.operation,
//                 key: query.conditions.id  // Key-value stores typically query by key
//             });
//         } else if (supportedDatabases.graph.includes(db)) {
//             parsedQueries.push({
//                 dbType: 'graph',
//                 database: db,
//                 operation: query.operation,
//                 node: query.conditions.id  // Assuming node traversal in graph databases
//             });
//         }
//     });

//     return parsedQueries;
// }

// // Export the query processor for use in the synchronization engine
// module.exports = { processQuery };