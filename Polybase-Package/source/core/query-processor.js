/*

 - Processes and validates queries for different databases.
 - Breaks down queries into components, checks for correctness, and prepares them for execution by the corresponding database adapter.
 - Supports multiple database types: SQL, NoSQL, Key-Value stores, and Graph databases.
 - Creates detailed execution plans based on the database type and operation.

*/

const { getState } = require('../service-utils/state-utils');

// Supported databases categorized by type
const supportedDatabases = {
    sql: ['PostgreSQL', 'MySQL'],
    nosql: ['MongoDB', 'CouchDB'],
    kvstore: ['Redis'],
    graph: ['Neo4j']
};

// Valid operations for each type of database
const validOperations = {
    sql: ['select', 'insert', 'update', 'delete'],
    nosql: ['find', 'insert', 'update', 'delete'],
    kvstore: ['get', 'set', 'delete'],
    graph: ['match', 'create', 'delete']
};

// Validate if the query matches the database type and supported operations
function validateQuery(dbType, operation, params) {
    const state = getState(dbType);
    const connection = state?.connection;

    if (!connection) {
        console.log(`Invalid dbType: ${dbType}. No active connection found.`);
        return false;
    }

    const validOps = validOperations[dbType] || [];
    if (!validOps.includes(operation.toLowerCase())) {
        console.log(`Invalid operation: ${operation}. Expected one of: ${validOps.join(', ')}`);
        return false;
    }

    if (!params || typeof params !== 'object') {
        console.log(`Invalid parameters: ${params}. Expected a valid object with query details.`);
        return false;
    }

    console.log('Query validation successful.');
    return true;
}

// Process a single query for the specified database type
function processSingleQuery(dbType, operation, params) {
    const isValid = validateQuery(dbType, operation, params);

    if (!isValid) {
        return { error: `Query validation failed for ${dbType}. Please ensure the query follows the standard format.` };
    }

    return { executionPlan: `Plan for ${operation.toUpperCase()} on ${dbType}` };
}

// Process queries across multiple databases
function processQuery(query) {
    const { operation, params, databases } = query;
    const parsedQueries = [];

    // Process each database specified in the query
    databases.forEach(db => {
        if (supportedDatabases.sql.includes(db)) {
            parsedQueries.push({
                dbType: 'sql',
                database: db,
                ...processSingleQuery('sql', operation, params)
            });
        } else if (supportedDatabases.nosql.includes(db)) {
            parsedQueries.push({
                dbType: 'nosql',
                database: db,
                ...processSingleQuery('nosql', operation, params)
            });
        } else if (supportedDatabases.kvstore.includes(db)) {
            parsedQueries.push({
                dbType: 'kvstore',
                database: db,
                ...processSingleQuery('kvstore', operation, { key: params.key })
            });
        } else if (supportedDatabases.graph.includes(db)) {
            parsedQueries.push({
                dbType: 'graph',
                database: db,
                ...processSingleQuery('graph', operation, { node: params.node })
            });
        } else {
            parsedQueries.push({ error: `Unsupported database: ${db}` });
        }
    });

    return parsedQueries;
}

module.exports = { processQuery, processSingleQuery };