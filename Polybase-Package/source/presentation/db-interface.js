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

/**
 * Determines execution plan for a user CLI command
 * @param {String} dbType The type of database for this query
 * @param {Object} query The query/task to perform
 * @returns 
 */
async function execQuery(dbType, query) {
    console.log(`Database Interface: Received query for ${dbType}`);

    console.log('...simulating datbase query processing.');
    await new Promise(resolve => setTimeout(resolve, 3000));

   
    const executionPlan = processQuery(query);
    const transformedData = transformData(query.params);
    const syncResult = synchronizeData(dbType, 'targetDB');
    const transactionStatus = manageTransaction([query]);
    

    // let dbResult;
    // switch(dbType) {
    //     case 'SQL':
    //         dbResult = await sqlAdapter.execute(executionPlan, transformedData);
    //         break;
    //     case 'NoSQL':
    //         dbResult = await nosqlAdapter.execute(executionPlan, transformedData);
    //         break;
    //     // Add more cases for other database types
    //     default:
    //         throw new Error(`Unsupported database type: ${dbType}`);
    // }


    return {
        executionPlan,
        transformedData,
        syncResult,
        transactionStatus,
        result: `Mock result from ${dbType} with operation ${query.operation}`
    };

}

module.exports = { execQuery };
