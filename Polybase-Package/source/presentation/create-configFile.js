const fs = require('fs');
const path = require('path');
const { startPolybase } = require('./init');

/**
 * Create method automatically createas a polbyase-config.json 
 * file with prepopulated fields for the databases supported
 * 
 */
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
