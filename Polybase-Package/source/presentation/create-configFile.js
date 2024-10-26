/* 

- Automates the creation of a `Polybase-Config.json` file.
- Populates the file with default configuration fields for MongoDB, PostgreSQL, Redis, InfluxDB, and Neo4j databases.
- Supports easy initial setup for users by pre-filling connection details (e.g., URIs, credentials).
- Ensures Polybase can interact with multiple databases through the prepopulated config fields.
- Allows users to customize the generated configuration to suit their environment.

*/

const fs = require('fs');
const path = require('path');
const { startPolybase } = require('./init');

async function create() {

  const defaultConfig = {
    mongo: { uri: 'mongodb+srv://your_mongo_uri', database: 'your_database' },
    postgres: { user: 'your_user', host: 'your_host', database: 'your_database', password: 'your_password', port: 5432 },
    redis: { host: 'your_host', port: 6379, username: 'default', password: 'your_password' },
    influx: { url: 'https://your_influx_url', token: 'your_token', org: 'your_org', bucket: 'your_bucket' },
    neo4j: { uri: 'neo4j://your_uri', username: 'your_username', password: 'your_password' }
  };

  const configFilePath = path.resolve(process.cwd(), 'Polybase-Config.json');

  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
}

module.exports = { create };
