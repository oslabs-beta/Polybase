/**
 * connection-pool.js
 * 
 * manages the pooling of database connections for efficiency and persistency.
 * Ensures application can handle multiple simultaneous connections 
 * without overhead of constantly opening/closing database connections.
 */

/**
 * @TODO Add more client libraries for stretch db
 */
const { MongoClient } = require('mongodb');
const { Pool: PostgresPool } = require('pg');
const neo4j = require('neo4j-driver');
const Redis = require('ioredis');
const { InfluxDB } = require('@influxdata/influxdb-client');

/**
 * Establish connection with InfluxDB 2.x
 * @param {Object} config object 
 * @returns {InfluxDB} instance
 */
async function configureInfluxConnection(config) {
    try {
        // Create a new InfluxDB client instance
        const influxDB = new InfluxDB({
            url: config.url,
            token: config.token
        });

        // Log the successful connection message
        logInfo('✔ Connection to InfluxDB initialized.', { url: config.url }, true);
        logInfo(`Detailed: Connected to InfluxDB at ${config.url} using bucket ${config.bucket}`, { config }, false);

        // Return the InfluxDB instance for later use
        return influxDB;
    } catch (err) {
        // Log and handle any errors during the connection process
        logError(`InfluxDB connection error: ${err.message}`, { error: err });
        throw handleError(`InfluxDB connection error: ${err.message}`, 500);
    }
}
const { handleError } = require('../service-utils/error-handling');
const { logInfo, logError } = require('../service-utils/logging');


/**
 * Establishes connection to neo4j via pooling
 * @param {*} config object provided by user 
 */
async function configureNeo4jConnection(config) {

    try {
        //@NOTE creating Driver instance provide info on *how* to access the database, 
        //but does not actually establish cnx - deferred until time of first query execc
        const driver = neo4j.driver(
            config.uri,
            neo4j.auth.basic(config.username, config.password), {
            maxConnectionPoolSize: 10,
            connectionTimeout: 30000,
        }
        );

        // console.log('Cnx established');
        //verify immediately that driveer CAN connect valid creds, compatible version, et al
        const serverInfo = await driver.getServerInfo();
        console.log(serverInfo);
        const session = driver.session();
        await session.run('RETURN 1');
        await session.close();
        // console.log(session);
        //log high-level status message in the terminal
        logInfo('✔ Connection to Neo4j established.', { config }, true); // Display in console
        //log detailed information into the file polyog that should auto populate in directory
        logInfo(`Detailed: Connected to Neo4j: ${config.database}`, { config }, false); //only in file
        return driver;
        
        //TODO: when to use driver.close() ? 
      
    }
    catch (err) {
        logError(`Neo4j connection error: ${err.message}`, { error: err });
        throw handleError(`Neo4j connection error: ${err.message}`, 500);


    }
}


/**
 * Pooling mongoDB connection 
 * @param {Object} config Configuration object passed by user
 * @returns the connection to the database
 */
// MongoDB connection
async function configureMongoConnection(config) {
    // Show loading message in the console

    try {
        const client = await MongoClient.connect(config.uri, {
            maxPoolSize: 10,
        });
        const db = client.db(config.database);

        //log high-level status message in the terminal
        logInfo('✔ Connection to MongoDB established.', { database: config.database }, true); // Display in console
        //log detailed information into the file polybase.log that should auto populate in directory
        logInfo(`Detailed: Connected to MongoDB: ${config.database}`, { config }, false); //only in file

        return db;
    } catch (err) {
        logError(`MongoDB connection error: ${err.message}`, { error: err });
        throw handleError(`MongoDB connection error: ${err.message}`, 500);
    }
}

// Function to fetch the schema from MongoDB
async function getMongoSchema(db) {
    try {
        const collections = await db.listCollections().toArray();
        const schema = {};

        for (let collection of collections) {
            const sampleDocument = await db.collection(collection.name).findOne();
            schema[collection.name] = sampleDocument ? Object.keys(sampleDocument) : 'Empty collection';
        }

        logInfo('Fetched MongoDB schema', { schema });
        return schema;
    } catch (error) {
        logError('Error fetching MongoDB schema', { error });
        throw new Error('Failed to fetch MongoDB schema');
    }
}

/**
 * Establishing postgres connection via connection pooling
 * @param {Object} valid configuration object 
 * @returns 
 */
async function configurePostgresConnection(config) {
    //show user that connection trying

    const pool = new PostgresPool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port,
        max: 10,
        idleTimeoutMillis: 30000,
    });

    try {
        const client = await pool.connect();

        //log high-level message to console and detailed msg to .log file
        logInfo('✔ Connection to PostgreSQL established.', { database: config.database }, true);
        logInfo(`Detailed: Connected to PostgreSQL at ${config.host}`, { config }, false);

        return client;
    } catch (error) {
        logError(`PostgreSQL connection error: ${error.message}`, { error });
        throw handleError(`PostgreSQL connection error: ${error.message}`, 500);
    }
}

/**
 * Establish connection with InfluxDB
 * @param {Object} config object 
 * @returns 
 */
async function configureInfluxConnection(config) {
    try {
        // Create a new InfluxDB instance using the provided URL and token
        const influxDB = new InfluxDB({
            url: config.url,
            token: config.token
        });

        // Logging successful connection message
        logInfo('✔ Connection to InfluxDB initialized.', { url: config.url }, true);
        logInfo(`Detailed: Connected to InfluxDB at ${config.url} using bucket ${config.bucket}`, { config }, false);

        // Return the InfluxDB instance for later use
        return influxDB;
    } catch (err) {
        // Log and handle any errors during the connection process
        logError(`InfluxDB connection error: ${err.message}`, { error: err });
        throw handleError(`InfluxDB connection error: ${err.message}`, 500);
    }
}

/**
 * Sets up Redis connection -- using ioredis
 * @param {Object} config - Redis configuration object passed by user
 * @returns {Object} - Redis client instance
 */
function configureRedisConnection(config) {
   
    logInfo('Attempting to connect to Redis...', {}, false);

    return new Promise((resolve, reject) => {
        const redis = new Redis({
            host: config.host,
            port: config.port,
            username: config.username,  //optional - only if password protected
            password: config.password,  //optional 
        });

        redis.on('connect', () => {
<<<<<<< HEAD

            logInfo('✔ Connection to Redis established.', { url: config.url }, true);
            logInfo(`Detailed: Connected to Redis at ${config.url}`, { config }, false);

            resolve(redis);
=======
            logInfo('✔ Connection to Redis established.', { host: config.host, port: config.port }, true);
            logInfo(`Detailed: Connected to Redis at ${config.host}:${config.port}`, { config }, false);
            resolve(redis);  //return redic client 
>>>>>>> library-features
        });

        redis.on('error', (error) => {
            logError(`Redis connection error: ${error.message}`, { error });
            reject(handleError(`Redis connection error: ${error.message}`, 500));
        });
    });
}







module.exports = {
    configureNeo4jConnection,
    configureMongoConnection,
    configureRedisConnection,
    configureInfluxConnection,
    configurePostgresConnection
};
