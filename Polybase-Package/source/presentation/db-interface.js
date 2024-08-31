/**
 * db-interface.js
 * 
 * Provides layer of abstraction between presentation and core logic.
 * Routes database queries and operations from CLI to the corresponding core logic
 * modules and begins separation of concerns 
 * 
 * THOUGHT: for modularity, should interact with the core logic (e..g the process/transform), 
 * but should ensure only routing between layers --not the core logic itself
 */


const { processQuery } = require('../core/query-processor');
const { transformData } = require('../core/data-transformation');
const { synchronizeData } = require('../core/sychronization-engine');
const { manageTransaction } = require('../core/transaction-manager');
const { handleError } = require('../service-utils/error-handling');

/**
 * Determines execution plan for a user CLI command
 * @param {String} dbType The type of database for this query
 * @param {Object} query The query/task to perform
 * @returns 
 */
async function execQuery(dbType, query) {
    try {
        console.log(`Database Interface: Received query for ${dbType}`);
        console.log('...simulating database query processing.');


        const executionPlan = processQuery(query);
        const transformedData = transformData(query.params);
        const syncResult = synchronizeData(dbType, 'targetDB');
        const transactionStatus = manageTransaction([query]);

        return {
            executionPlan,
            transformedData,
            syncResult,
            transactionStatus,
            result: `Mock result from ${dbType} with operation ${query.operation}`
        };
    } catch (error) {
        return handleError(`Failed to execute query for ${dbType}: ${error.message}`, 500);
    }
}

module.exports = { execQuery };