const { processQuery } = require('../core/query-processor');
const { transformData } = require('../core/data-transformation');
const { synchronizeData } = require('../core/sychronization-engine');
const { manageTransaction } = require('../core/transaction-manager');
const { handleError } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');

/**
 * executes db query by routing through core modules (query processor, transformation, etc.)
 * @param {String} dbType type of database (e.g., mongo, postgres)
 * @param {Object} query the query to execute
 * @returns query result including execution plan, transformation, sync, etc.
 */
async function execQuery(dbType, query) {
    try {
        //logging execution request to the file, and confirm receipt to user via console
        logInfo(`received query for ${dbType}`, { query });
        console.log(`database interface: received query for ${dbType}`); 

        //this is just a simulation
        console.log('...simulating database query processing.');

        const executionPlan = processQuery(query); //gen execution plan
        const transformedData = transformData(query.params); //transform query params
        const syncResult = synchronizeData(dbType, 'targetDB'); //sync data
        const transactionStatus = manageTransaction([query]); //manage transaction 

        logInfo(`executed query for ${dbType}`, { executionPlan, transformedData, syncResult, transactionStatus }); // log deta
        return { executionPlan, transformedData, syncResult, transactionStatus, result: `mock result from ${dbType} with operation ${query.operation}` };
    } catch (error) {
        return handleError(`failed to execute query for ${dbType}: ${error.message}`, 500); 
    }
}

module.exports = { execQuery };
