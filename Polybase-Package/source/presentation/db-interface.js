const { processQuery } = require('../core/query-processor');
const { transformData } = require('../core/data-transformation');
const { synchronizeData } = require('../core/sychronization-engine');
const { manageTransaction } = require('../core/transaction-manager');
const { handleError } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');
const { mongoQuery } = require('../transformation/nosql-adapter');
const { getState } = require('../service-utils/state-utils');
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

        // console.log('...simulating database query processing.');
         const executionPlan = processQuery(dbType, query); // Generate execution plan
        const transformedQuery = transformData(dbType, query.params); 

        //executing MongoDB query if dbType is set to mongo
        let queryResult;
        if (dbType === 'mongo') {
            const state = getState(dbType); //getting entire connnection objwct
            const db = state.connection;    //getting the mongodb 

            if (!db) {
                throw new Error('No MongoDB connection found.');
            }

            console.log('MongoDB connection established. Executing query...');

            //pass the transformed query to the MongoDB adapter
            queryResult = await mongoQuery(db, query.operation, transformedQuery); // Execute the MongoDB query
        }


        console.log('Query Result:', queryResult, '\n\n');
        const syncResult = synchronizeData(dbType, 'targetDB'); //sync data
        const transactionStatus = manageTransaction([query]); //manage transaction 
        
        logInfo(`Executed query for ${dbType}`, { executionPlan, transformedQuery, syncResult, transactionStatus, queryResult }); // Log data
        return { executionPlan, transformedQuery, syncResult, transactionStatus, result: queryResult };
    } catch (error) {
        return handleError(`failed to execute query for ${dbType}: ${error.message}`, 500); 
    }
}

module.exports = { execQuery };
