/**
 * connection-pool.ts
 * 
 * Manages the pooling of database connections for efficiency and persistency.
 * Ensures the application can handle multiple simultaneous connections 
 * without overhead of constantly opening/closing database connections.
 */

import { MongoClient, Db } from 'mongodb';
import { Pool as PostgresPool, PoolClient } from 'pg';
import neo4j, { Driver, Session } from 'neo4j-driver';
import Redis, { Redis as RedisClient } from 'ioredis';
import { InfluxDB } from '@influxdata/influxdb-client';
import { handleError } from '../service-utils/error-handling';
import { logInfo, logError } from '../service-utils/logging';

// Define types for database configurations
type MongoConfig = {
    uri: string;
    database: string;
};

type PostgresConfig = {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
};

type Neo4jConfig = {
    uri: string;
    username: string;
    password: string;
    database: string;
};

type RedisConfig = {
    host: string;
    port: number;
    username?: string;
    password?: string;
};

type InfluxConfig = {
    url: string;
    token: string;
    bucket: string;
};

/**
 * Establish connection with InfluxDB 2.x
 * @param {InfluxConfig} config 
 * @returns {Promise<InfluxDB>} instance
 */
export async function configureInfluxConnection(config: InfluxConfig): Promise<InfluxDB> {
    try {
        const influxDB = new InfluxDB({
            url: config.url,
            token: config.token
        });

        logInfo('✔ Connection to InfluxDB initialized.', { url: config.url }, true);
        logInfo(`Detailed: Connected to InfluxDB at ${config.url} using bucket ${config.bucket}`, { config }, false);

        return influxDB;
    } catch (err) {
        logError(`InfluxDB connection error: ${err.message}`, { error: err });
        throw handleError(`InfluxDB connection error: ${err.message}`, 500);
    }
}

/**
 * Establishes connection to Neo4j via pooling
 * @param {Neo4jConfig} config 
 * @returns {Promise<Driver>} Neo4j Driver instance
 */
export async function configureNeo4jConnection(config: Neo4jConfig): Promise<Driver> {
    try {
        const driver = neo4j.driver(
            config.uri,
            neo4j.auth.basic(config.username, config.password),
            {
                maxConnectionPoolSize: 10,
                connectionTimeout: 30000,
            }
        );

        const serverInfo = await driver.getServerInfo();
        console.log(serverInfo);

        const session: Session = driver.session();
        await session.run('RETURN 1');
        await session.close();

        logInfo('✔ Connection to Neo4j established.', { config }, true);
        logInfo(`Detailed: Connected to Neo4j: ${config.database}`, { config }, false);
        return driver;

    } catch (err) {
        logError(`Neo4j connection error: ${err.message}`, { error: err });
        throw handleError(`Neo4j connection error: ${err.message}`, 500);
    }
}

/**
 * Establishes MongoDB connection via pooling
 * @param {MongoConfig} config 
 * @returns {Promise<Db>} MongoDB Database instance
 */
export async function configureMongoConnection(config: MongoConfig): Promise<Db> {
    try {
        const client = await MongoClient.connect(config.uri, { maxPoolSize: 10 });
        const db = client.db(config.database);

        logInfo('✔ Connection to MongoDB established.', { database: config.database }, true);
        logInfo(`Detailed: Connected to MongoDB: ${config.database}`, { config }, false);

        return db;
    } catch (err) {
        logError(`MongoDB connection error: ${err.message}`, { error: err });
        throw handleError(`MongoDB connection error: ${err.message}`, 500);
    }
}

/**
 * Fetches the schema from MongoDB
 * @param {Db} db - MongoDB Database instance
 * @returns {Promise<Record<string, any>>} MongoDB schema
 */
export async function getMongoSchema(db: Db): Promise<Record<string, any>> {
    try {
        const collections = await db.listCollections().toArray();
        const schema: Record<string, any> = {};

        for (const collection of collections) {
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
 * Establishes Postgres connection via pooling
 * @param {PostgresConfig} config 
 * @returns {Promise<PoolClient>} PostgreSQL Client instance
 */
export async function configurePostgresConnection(config: PostgresConfig): Promise<PoolClient> {
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
        logInfo('✔ Connection to PostgreSQL established.', { database: config.database }, true);
        logInfo(`Detailed: Connected to PostgreSQL at ${config.host}`, { config }, false);

        return client;
    } catch (error) {
        logError(`PostgreSQL connection error: ${error.message}`, { error });
        throw handleError(`PostgreSQL connection error: ${error.message}`, 500);
    }
}

/**
 * Sets up Redis connection using ioredis
 * @param {RedisConfig} config 
 * @returns {Promise<RedisClient>} Redis client instance
 */
export function configureRedisConnection(config: RedisConfig): Promise<RedisClient> {
    logInfo('Attempting to connect to Redis...', {}, false);

    return new Promise((resolve, reject) => {
        const redis = new Redis({
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password,
        });

        redis.on('connect', () => {
            logInfo('✔ Connection to Redis established.', { host: config.host, port: config.port }, true);
            logInfo(`Detailed: Connected to Redis at ${config.host}:${config.port}`, { config }, false);
            resolve(redis);
        });

        redis.on('error', (error) => {
            logError(`Redis connection error: ${error.message}`, { error });
            reject(handleError(`Redis connection error: ${error.message}`, 500));
        });
    });
}

// export {
//     configureInfluxConnection,
//     configureNeo4jConnection,
//     configureMongoConnection,
//     configurePostgresConnection,
//     configureRedisConnection,
// };
