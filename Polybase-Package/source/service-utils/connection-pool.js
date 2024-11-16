/*

 - Manages database connections using worker pools for concurrency control.
 - Uses a TaskQueue to handle tasks when worker threads are busy.
 - Supports connections for MongoDB, PostgreSQL, Neo4j, Redis, and InfluxDB.
 - Each database type has a separate worker pool with up to 10 workers.
 - Logs connection status and errors for monitoring and debugging.
 - Handles task execution in sequence to prevent overloading of worker threads.

*/

const { MongoClient } = require("mongodb");
const { Pool: PostgresPool } = require("pg");
const neo4j = require("neo4j-driver");
const Redis = require("ioredis");
const { InfluxDB } = require("@influxdata/influxdb-client");
const { handleError } = require("../service-utils/error-handling");
const { logInfo, logError } = require("../service-utils/logging");

// Task queue for handling task execution
class TaskQueue {
  constructor() {
    this.queue = [];
  }

  addTask(task) {
    this.queue.push(task);
    logInfo("Task added to queue", { task });
  }

  popTask() {
    return this.queue.shift();
  }

  hasTasks() {
    return this.queue.length > 0;
  }

  async processTask(task) {
    try {
      await task();
      if (this.hasTasks()) {
        const nextTask = this.popTask();
        await this.processTask(nextTask);
      }
    } catch (error) {
      logError("Error while processing task", { error });
      throw error;
    }
  }
}

// Worker pool for databases
class WorkerPool {
  constructor(maxWorkers) {
    this.maxWorkers = maxWorkers;
    this.activeWorkers = 0;
    this.taskQueue = new TaskQueue();
  }

  async runTask(task) {
    if (this.activeWorkers < this.maxWorkers) {
      this.activeWorkers++;
      try {
        logInfo("Starting task", { activeWorkers: this.activeWorkers });
        const result = await task();
        return result;
      } catch (error) {
        logError("Error in worker pool task", { error });
        throw error;
      } finally {
        this.activeWorkers--;
        logInfo("Task finished", { activeWorkers: this.activeWorkers });
        if (this.taskQueue.hasTasks()) {
          const nextTask = this.taskQueue.popTask();
          await this.runTask(nextTask);
        }
      }
    } else {
      this.taskQueue.addTask(task);
    }
  }
}

// Worker pools for specific databases
const neo4jPool = new WorkerPool(10);
const mongoPool = new WorkerPool(10);

// Connection functions
async function configureNeo4jConnection(config) {
  try {
    return await neo4jPool.runTask(async () => {
      if (!config.uri || !config.username || !config.password) {
        throw new Error("Invalid Neo4j configuration");
      }
      const driver = neo4j.driver(
        config.uri,
        neo4j.auth.basic(config.username, config.password),
        { maxConnectionPoolSize: 10, connectionTimeout: 30000 }
      );
      await driver.verifyConnectivity();
      logInfo("✔ Connection to Neo4j established.", { uri: config.uri });
      return driver;
    });
  } catch (error) {
    logError("Neo4j connection error", { error });
    throw handleError(`Neo4j connection error: ${error.message}`, 500);
  }
}

async function configureMongoConnection(config) {
  try {
    return await mongoPool.runTask(async () => {
      if (!config.uri || !config.database) {
        throw new Error("Invalid MongoDB configuration");
      }
      const client = await MongoClient.connect(config.uri, { maxPoolSize: 10 });
      const db = client.db(config.database);
      logInfo("✔ Connection to MongoDB established.", { database: config.database });
      return db;
    });
  } catch (error) {
    logError("MongoDB connection error", { error });
    throw handleError(`MongoDB connection error: ${error.message}`, 500);
  }
}

async function configurePostgresConnection(config) {
  try {
    if (!config.user || !config.host || !config.database || !config.password || !config.port) {
      throw new Error("Invalid PostgreSQL configuration");
    }
    const pool = new PostgresPool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    const client = await pool.connect();
    logInfo("✔ Connection to PostgreSQL established.", { database: config.database });
    return client;
  } catch (error) {
    logError("PostgreSQL connection error", { error });
    throw handleError(`PostgreSQL connection error: ${error.message}`, 500);
  }
}

async function configureInfluxConnection(config) {
  try {
    if (!config.url || !config.token || !config.bucket) {
      throw new Error("Invalid InfluxDB configuration");
    }
    const influxDB = new InfluxDB({ url: config.url, token: config.token });
    logInfo("✔ Connection to InfluxDB initialized.", { url: config.url });
    return influxDB;
  } catch (error) {
    logError("InfluxDB connection error", { error });
    throw handleError(`InfluxDB connection error: ${error.message}`, 500);
  }
}

async function configureRedisConnection(config) {
  try {
    if (!config.host || !config.port || !config.password) {
      throw new Error("Invalid Redis configuration");
    }
    const redis = new Redis({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
    });
    redis.on("connect", () => {
      logInfo("✔ Connection to Redis established.", { host: config.host, port: config.port });
    });
    redis.on("error", (error) => {
      logError("Redis connection error", { error });
    });
    return redis;
  } catch (error) {
    logError("Redis connection error", { error });
    throw handleError(`Redis connection error: ${error.message}`, 500);
  }
}

module.exports = {
  configureNeo4jConnection,
  configureMongoConnection,
  configureRedisConnection,
  configureInfluxConnection,
  configurePostgresConnection,
};