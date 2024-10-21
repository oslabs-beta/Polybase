/* 

- Executes database queries based on the type of database (MongoDB, PostgreSQL, Redis, Neo4j, InfluxDB).
- Processes queries, transforms data, and manages transactions across different databases.
- Synchronizes data with a target database after executing a query.
- Handles logging of query execution and errors.
- Retrieves database connections and checks for their availability before performing queries.
- Supports multiple database types, ensuring a unified query interface.

*/


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


async function execQuery(dbType, query) {
    try {

        logInfo(`received query for ${dbType}`, { query });
        const executionPlan = processQuery(dbType, query);
        const transformedQuery = transformData(dbType, query.params);

        let queryResult;

        if (dbType === 'mongo') {
            const state = getState(dbType);
            const db = state.connection;

            if (!db) {
                throw new Error('No MongoDB connection found.');
            }

            queryResult = await mongoQuery(db, query.operation, transformedQuery);
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

        }

        else if (dbType === 'neo4j') {

            const state = getState(dbType);
            const driver = state.connection;

            if (!driver) throw new Error('No Neo4j connection found.');
            const session = driver.session();
            queryResult = await neo4jQuery(session, query.operation, transformedQuery);
            await session.close();
        }

        else if (dbType === 'influx') {

            const state = getState(dbType);
            const influxDB = state.connection;

            if (!influxDB) {
                throw new Error('No InfluxDB connection found.')
            }
            console.log('influxdb');
            queryResult = await influxQuery(influxDB, query.operation, transformedQuery);

        }

        const syncResult = synchronizeData(dbType, 'targetDB');
        const transactionStatus = manageTransaction([query]);

        logInfo(`Executed query for ${dbType}`, { executionPlan, transformedQuery, syncResult, transactionStatus, queryResult });
        return { executionPlan, transformedQuery, syncResult, transactionStatus, result: queryResult };

    } catch (error) {
        return handleError(`failed to execute query for ${dbType}: ${error.message}`, 500);
    }
}

module.exports = { execQuery };
