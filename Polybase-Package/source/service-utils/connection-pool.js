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


/**
 * Pooling mongoDB connection 
 * @param {Object} config Configuration object passed by user
 * @returns the connection to the database
 */
async function configureMongoDBConnection(config) {
    //initiates contact with URI, assumed formatting
    try {
        const client = await MongoClient.connect(config.uri, {
            maxPoolSize: 10, 
        });
        const db = client.db(config.database);
        console.log(`Connected to MongoDB: ${config.database}`);
        return db; 
    } catch (err) {
        throw handleError('MongoDB connection error: ' + error.message, 500);
        throw err;
    }
}


/**
 * Connecting to Postgres database 
 * @param {Object} config Configuration object passed by user 
 * @returns Connection result of establishing PostgreSQL pool
 */
async function configurePostgresConnection(config) {
    const pool = new PostgresPool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port,
        max: 10, 
        idleTimeoutMillis: 30000, //idle connections closed after 30sec
    });

    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL');
        return client; // Return the pooled client
    } catch (err) {
        throw handleError('PostgreSQL connection error: ' + error.message, 500);
    }
}

/**
 * 
 * @param {*} config 
 * @returns 
 */
function configureRedisConnection(config) {
    return new Promise((resolve, reject) => {
        const redis = new Redis(config.url);
        redis.on('connect', () => {
            console.log('Connected to Redis');
            resolve(redis); // Return the Redis client
        });
        redis.on('error', (err) => {
            reject(handleError('Redis connection error: ' + error.message, 500));
        });
    });
}

// InfluxDB connection (InfluxDB client handles its connections, no explicit pooling needed)
async function configureInfluxDBConnection(config) {
    try {
        const influx = new Influx.InfluxDB({
            url: config.url,
            token: config.token,
        });
        console.log('Connected to InfluxDB');
        return influx; // Return the InfluxDB client
    } catch (err) {
        throw handleError('InfluxDB connection error: ' + error.message, 500);
    }
}


// Export the functions for use in init.js
module.exports = {
    configureMongoDBConnection,
    configureRedisConnection,
    configureInfluxDBConnection,
    configurePostgresConnection
};
