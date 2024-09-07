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
const Redis = require('ioredis');
const Influx = require('influx');
const { handleError } = require('../service-utils/error-handling');
const { logInfo } = require('../service-utils/logging');

/**
 * Pooling mongoDB connection 
 * @param {Object} config Configuration object passed by user
 * @returns the connection to the database
 */
// MongoDB connection
async function configureMongoDBConnection(config) {
    // Show loading message in the console
    logInfo('...Connecting to MongoDB...', {}, true);

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
    logInfo('...Connecting to PostgreSQL...', {}, true);

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
 * Setting up redis conneciton -- very simplified version
 * @param {Object} config object 
 * @returns 
 */
function configureRedisConnection(config) {
    //show loading message
    logInfo('...Connecting to Redis...', {}, true);

    /**
     * @TODO need to figure out how we want to do this - accessing user memory
     */
    return new Promise((resolve, reject) => {
        const redis = new Redis(config.url);

        redis.on('connect', () => {
            
            logInfo('✔ Connection to Redis established.', { url: config.url }, true); 
            logInfo(`Detailed: Connected to Redis at ${config.url}`, { config }, false); 

            resolve(redis);
        });

        redis.on('error', (error) => {
            logError(`Redis connection error: ${error.message}`, { error });
            reject(handleError(`Redis connection error: ${error.message}`, 500));
        });
    });
}

/**
 * Establish connection with InfluxDB
 * @param {Object} config object 
 * @returns 
 */
async function configureInfluxDBConnection(config) {

    /*
    * @TODO 
    */
    logInfo('...Connecting to InfluxDB...', {}, true);

    try {
        const influx = new Influx.InfluxDB({
            url: config.url,
            token: config.token,
        });

        logInfo('✔ Connection to InfluxDB established.', { url: config.url }, true); // Display in console
        logInfo(`Detailed: Connected to InfluxDB at ${config.url}`, { config }, false); // Only in file

        return influx;
    } catch (error) {
        logError(`InfluxDB connection error: ${error.message}`, { error });
        throw handleError(`InfluxDB connection error: ${error.message}`, 500);
    }
}



module.exports = {
    configureMongoDBConnection,
    configureRedisConnection,
    configureInfluxDBConnection,
    configurePostgresConnection
};
