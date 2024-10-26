- **`config-management.js`**:
  - loads configuration (`getConfig`) -- either from file (Polybase-Config.json) or directly --object literal passed as
  arg to 'config' param.
  - validates configuration --both inputs (`validateConfig`).
  - (more stretch) allows user to update configuration dynamically (`updateConfig`).

- **`state-manager.js`**:
  - manages dynamic state during a polybase us --- including connections and configurations.
  - Adds cnx and configs to the state store.

- **`init.js`**:
  - loads the configuration.
  - validates the provided configuration object.
  - calls `configureDatabaseConnections` to connect to the various databases based on the configuraiton the user gave.
  - inits the Polybase instance (`PolyBaseInstance.init()`).

- **`connection-pool.js`**:
  - contains tthe individual connection functions for different databases (MVP -- MongoDB, PostgreSQL, Neo4j, Redis, InfluxDB).
  - each connection function establishes a connection to its respective database and returns the connection object.

- **`execQuery` function**:
  - recs the database type and query object.
  - calls approp transformation function for the database (from `data-transformation.js`).
  - exec the query using the correct adapter (e.g., `mongoQuery`, `postgresQuery`).
  - (stretch) sets up the execution plan (e.g. query database A, inner join results on database B)
  - (stretch) synchronizes the data using `synchronizeData`.
  - (stretch) manages transaction through `manageTransaction`.

- **Query Execution Process**:
  - receives query in the presentation layer (static or CLI).
  - proess and validates the query using `query-processor.js`.
  - (stretch) transforms the query based on the target database using `data-transformation.js`.
  - execs the query on the corresponding database.

- **Adapters for Databases**:
  - **`mongoQuery`**: handles MongoDB queries  -- find, insert, update, and delete.
  - **`postgresQuery`**: execx PostgreSQL ops -- like select, insert, update, delete.
  - **`redisQuery`**: manages Redis key-value ops.
  - **`influxQuery`**: execs time-series queries, -- insertions, and operations on InfluxDB.
  - **`neo4jQuery`**: handles Neo4j ops -- as match, create, update, delete.

- **`cli-interface.js`**:
  - provides an interface for users to interact with Polybase via commands, allowing them to send queries directly to the system.
