const { processQuery } = require('../core/query-processor');
const { transformData } = require('../core/data-transformation');
const { synchronizeData } = require('../core/sychronization-engine');
const { manageTransaction } = require('../core/transaction-manager');
const { handleError } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');
const { mongoQuery } = require('../transformation/nosql-adapter');
const { redisQuery } = require('../transformation/kvstore-adapter');
const { postgresQuery } = require('../transformation/sql-adapter');
const { influxQuery } = require('../transformation/timeseries-adapter');
const { getState } = require('../service-utils/state-utils');
const { neo4jQuery } = require('../transformation/graph-adapter');

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
        // console.log(`database interface: received query for ${dbType}`); 

        // console.log('...simulating database query processing.');
        const executionPlan = processQuery(dbType, query); // Generate execution plan
        const transformedQuery = transformData(dbType, query.params); 

        //executing MongoDB query if dbType is set to mongo
        let queryResult;
        if (dbType === 'mongo') {
            const state = getState(dbType); //getting entire connnection object
            const db = state.connection;    //getting the mongodb 

            if (!db) {
                throw new Error('No MongoDB connection found.');
            }
            // console.log('MongoDB connection established. Executing query...');
            //pass the transformed query to the MongoDB adapter
            queryResult = await mongoQuery(db, query.operation, transformedQuery); // Execute the MongoDB query
        }
          else if (dbType === 'postgres') {
            const state = getState(dbType);
            const client = state.connection;

            if (!client) {
                throw new Error('No PostgreSQL connection found.');
            }
            queryResult = await postgresQuery(client, query.operation, transformedQuery);
        }
            else if (dbType === 'redis') {
                const state = getState(dbType);
                const client = state.connection;

            if (!client) {
                throw new Error('No Redis connection found.');
            }

            queryResult = await redisQuery(client, query.operation, transformedQuery);
            // console.log(queryResult);
        }
            
        else if (dbType === 'neo4j') {
            const state = getState(dbType);
            const driver = state.connection;
            if (!driver) throw new Error('No Neo4j connection found.');
            const session = driver.session();
            queryResult = await neo4jQuery(session, query.operation, transformedQuery);
            await session.close();
        }

        // handling InfluxDB query
        else if (dbType === 'influx') {

            const state = getState(dbType);
            const influxDB = state.connection;

            if (!influxDB) {
                throw new Error('No InfluxDB connection found.')
            }
            console.log('influxdb');
            queryResult = await influxQuery(influxDB, query.operation, transformedQuery); 

        }

        // console.log('Query Result:', queryResult, '\n\n');
        const syncResult = synchronizeData(dbType, 'targetDB'); //sync data
        const transactionStatus = manageTransaction([query]); //manage transaction 
        
        logInfo(`Executed query for ${dbType}`, { executionPlan, transformedQuery, syncResult, transactionStatus, queryResult }); // Log data
        return { executionPlan, transformedQuery, syncResult, transactionStatus, result: queryResult };
    } catch (error) {
        return handleError(`failed to execute query for ${dbType}: ${error.message}`, 500); 
    }
}

module.exports = { execQuery };
