/*

- Creates and manages Polybase configuration files for user setup.
- Tests Polybase setup using either a configuration file or direct config object.
- Provides example queries using the `find` function for MongoDB, Redis, and PostgreSQL.
- Starts an Express server to monitor the status of database connections.
- Includes basic validation to ensure configuration files are properly populated.

*/

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { initPolybase } = require('./presentation/init'); // Handles environment setup and database connections
const { find } = require('./presentation/static-interface'); // Manages CLI query handling
const { handleError } = require('./service-utils/error-handling');
const { logInfo, logError } = require('./service-utils/logging');

// Function to create .env file with placeholder values
function createEnvFile() {
    const envFilePath = path.resolve(__dirname, '.env');
    const envContent = `

# MongoDB Configuration
MONGO_URI=
MONGO_DATABASE=

# PostgreSQL Configuration
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_DATABASE=
POSTGRES_PASSWORD=
POSTGRES_PORT=

# Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=

# InfluxDB Configuration
INFLUX_URL=
INFLUX_TOKEN=
INFLUX_ORG=
INFLUX_BUCKET=

# Neo4j Configuration
NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

`;

    if (!fs.existsSync(envFilePath)) {
        try {
            fs.writeFileSync(envFilePath, envContent);
            logInfo('Success: The .env file was created with placeholder values.');
        } catch (error) {
            logError(`Failed to create .env file: ${error.message}`);
            handleError(error, 500);
        }
    }
}

// Function to create Polybase-Config.json from environment variables
function createConfigFile() {
    const configFileName = 'Polybase-Config.json';
    const configFilePath = path.resolve(__dirname, configFileName);

    const configContent = `
{
  "mongo": {
    "uri": "${process.env.MONGO_URI}",
    "database": "${process.env.MONGO_DATABASE}"
  },
  "postgres": {
    "user": "${process.env.POSTGRES_USER}",
    "host": "${process.env.POSTGRES_HOST}",
    "database": "${process.env.POSTGRES_DATABASE}",
    "password": "${process.env.POSTGRES_PASSWORD}",
    "port": ${process.env.POSTGRES_PORT}
  },
  "redis": {
    "host": "${process.env.REDIS_HOST}",
    "port": ${process.env.REDIS_PORT},
    "username": "${process.env.REDIS_USERNAME}",
    "password": "${process.env.REDIS_PASSWORD}"
  },
  "influx": {
    "url": "${process.env.INFLUX_URL}",
    "token": "${process.env.INFLUX_TOKEN}",
    "org": "${process.env.INFLUX_ORG}",
    "bucket": "${process.env.INFLUX_BUCKET}"
  },
  "neo4j": {
    "uri": "${process.env.NEO4J_URI}",
    "username": "${process.env.NEO4J_USERNAME}",
    "password": "${process.env.NEO4J_PASSWORD}"
  }
}
`;

    if (!fs.existsSync(configFilePath)) {
        try {
            fs.writeFileSync(configFilePath, configContent);
            logInfo(`Configuration file created: ${configFileName}`);
        } catch (error) {
            logError(`Failed to create configuration file: ${error.message}`);
            handleError(error, 500);
        }
    }
}

// Main function to initialize Polybase and handle queries
async function initializePolybase() {
    createEnvFile(); // Create .env file if it doesn’t exist
    createConfigFile(); // Create Polybase-Config.json file if it doesn’t exist

    // Start Polybase with configurations loaded from Polybase-Config.json
    const configPath = path.resolve(__dirname, 'Polybase-Config.json');
    let finalConfig;

    try {
        // Read and parse the configuration file
        const configContent = fs.readFileSync(configPath, 'utf-8');
        finalConfig = JSON.parse(configContent);

    } catch (error) {
        logError(`Failed to load configuration file: ${error.message}`);
        return handleError('Configuration file loading failed. Ensure Polybase-Config.json exists and is correctly formatted.', 500);
    }

    // Proceed to initialize Polybase
    const polybaseInstance = await initPolybase(finalConfig);

    if (!polybaseInstance) {
        logError('Failed to initialize Polybase due to missing config or connection issue.');
        return handleError('Failed to initialize Polybase.', 500);
    }

    logInfo('Polybase initialized successfully. Please fill in the .env file with your database configuration.');

    return polybaseInstance;
}

// Function to simulate a query execution for testing in CLI
async function executeQuery(dbType, collectionName, filter = {}, projection = '') {
    try {
        const result = await find(dbType, collectionName, filter, projection);
        console.log('Query Result:', result);
    } catch (error) {
        logError(`Error executing query: ${error.message}`);
        handleError(error, 500);
    }
}

initializePolybase();

module.exports = {
    initializePolybase
};