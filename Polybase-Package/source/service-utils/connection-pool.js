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

// Manages tasks when worker threads are busy
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
}

// Manages worker threads for task concurrency
class WorkerPool {
  constructor(maxWorkers) {
    this.maxWorkers = maxWorkers;
    this.activeWorkers = 0;
    this.taskQueue = new TaskQueue();
  }
  async runTask(task) {
    if (this.activeWorkers < this.maxWorkers) {
      this.activeWorkers++;
      logInfo("Starting task, active workers:", {
        activeWorkers: this.activeWorkers,
      });
      await task();
      this.activeWorkers--;
      logInfo("Task finished, returning worker", {
        activeWorkers: this.activeWorkers,
      });
      if (this.taskQueue.hasTasks()) {
        const nextTask = this.taskQueue.popTask();
        await this.runTask(nextTask);
      }
    } else {
      this.taskQueue.addTask(task);
    }
  }
}

// Worker pools for each database type
const mongoPool = new WorkerPool(10);
const postgresPool = new WorkerPool(10);
const neo4jPool = new WorkerPool(10);
const redisPool = new WorkerPool(10);
const influxPool = new WorkerPool(10);

// Establishes Neo4j connection using a worker pool
async function configureNeo4jConnection(config) {
  await neo4jPool.runTask(async () => {
    try {
      const driver = neo4j.driver(
        config.uri,
        neo4j.auth.basic(config.username, config.password),
        { maxConnectionPoolSize: 10, connectionTimeout: 30000 }
      );
      const serverInfo = await driver.getServerInfo();
      console.log(serverInfo);
      const session = driver.session();
      await session.run("RETURN 1");
      await session.close();
      logInfo("✔ Connection to Neo4j established.", { config }, true);
      logInfo(`Detailed: Connected to Neo4j: ${config.database}`, { config }, false);
      return driver;
    } catch (error) {
      logError(`Neo4j connection error: ${error.message}`, { error });
      throw handleError(`Neo4j connection error: ${error.message}`, 500);
    }
  });
}

// Establishes MongoDB connection using a worker pool
async function configureMongoConnection(config) {
  await mongoPool.runTask(async () => {
    try {
      const client = await MongoClient.connect(config.uri, { maxPoolSize: 10 });
      const db = client.db(config.database);
      logInfo("✔ Connection to MongoDB established.", { database: config.database }, true);
      return db;
    } catch (error) {
      logError(`MongoDB connection error: ${error.message}`, { error });
      throw handleError(`MongoDB connection error: ${error.message}`, 500);
    }
  });
}

// Establishes PostgreSQL connection using a worker pool
async function configurePostgresConnection(config) {
  await postgresPool.runTask(async () => {
    try {
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
      logInfo("✔ Connection to PostgreSQL established.", { database: config.database }, true);
      return client;
    } catch (error) {
      logError(`PostgreSQL connection error: ${error.message}`, { error });
      throw handleError(`PostgreSQL connection error: ${error.message}`, 500);
    }
  });
}

// Establishes InfluxDB connection using a worker pool
async function configureInfluxConnection(config) {
  await influxPool.runTask(async () => {
    try {
      const influxDB = new InfluxDB({ url: config.url, token: config.token });
      logInfo("✔ Connection to InfluxDB initialized.", { url: config.url }, true);
      logInfo(`Detailed: Connected to InfluxDB at ${config.url} using bucket ${config.bucket}`, { config }, false);
      return influxDB;
    } catch (error) {
      logError(`InfluxDB connection error: ${error.message}`, { error });
      throw handleError(`InfluxDB connection error: ${error.message}`, 500);
    }
  });
}

// Establishes Redis connection using a worker pool
async function configureRedisConnection(config) {
  await redisPool.runTask(
    () =>
      new Promise((resolve, reject) => {
        const redis = new Redis({
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
        });
        redis.on("connect", () => {
          logInfo("✔ Connection to Redis established.", { host: config.host, port: config.port }, true);
          resolve(redis);
        });
        redis.on("error", (error) => {
          logError(`Redis connection error: ${error.message}`, { error });
          reject(handleError(`Redis connection error: ${error.message}`, 500));
        });
      })
  );
}

module.exports = {
  configureNeo4jConnection,
  configureMongoConnection,
  configureRedisConnection,
  configureInfluxConnection,
  configurePostgresConnection,
};