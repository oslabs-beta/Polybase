/*

 - Creates and manages Polybase configuration files for user setup.
 - Tests Polybase setup using either a configuration file or direct config object.
 - Provides example queries using the `find` function for MongoDB, Redis, and PostgreSQL.
 - Starts an Express server to monitor the status of database connections.
 - Includes basic validation to ensure configuration files are properly populated.

*/

const { startPolybase } = require('./presentation/init');
const { create } = require('./presentation/create-configFile');
const { find } = require('./presentation/static-Interface');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const PORT = 3001;

// Creates a config file for Polybase
async function createConfigFile() {
    create();
    console.log('Configuration file "Polybase-Config.json" created. \n 1. Fill in the configuration information for the databases you\'d like to connect');
}

// Tests Polybase setup using a configuration file
async function testWithConfigFile() {
    try {
        const configFilePath = path.resolve(process.cwd(), 'Polybase-Config.json');
        if (!fs.existsSync(configFilePath)) {
            throw new Error('Config file not found. Please create the config file first.');
        }

        const fileContent = fs.readFileSync(configFilePath, 'utf-8');
        const config = JSON.parse(fileContent);
        if (!config.mongo.uri || config.mongo.uri.includes('your_mongo_uri')) {
            console.log('Please fill in the correct values in the config file before starting Polybase.');
            return;
        }

        // Start Polybase using the populated config file
        const polybaseInstance = await startPolybase(config);
        console.log('Polybase started successfully using the populated config file.');
        startServer(polybaseInstance);
    } catch (error) {
        console.error('Error starting Polybase with config file:', error);
    }
}

// Load and parse the configuration file
function loadConfig(configFilePath) {
    const fileContent = fs.readFileSync(configFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Tests Polybase setup with a direct configuration object
async function testWithConfigObject() {
    const config = {
        mongo: {
            uri: process.env.MONGO_URI,
            database: process.env.MONGO_DATABASE
        }
        ,
        postgres: {
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        }
        ,
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD
        },
        influx: {
            url: process.env.INFLUX_URL,
            token: process.env.INFLUX_TOKEN,
            org: process.env.INFLUX_ORG,
            bucket: process.env.INFLUX_BUCKET
        },
        neo4j: {
            uri: process.env.NEO4J_URI,
            username: process.env.NNEO4J_USERNAME,
            password: process.env.NEO4J_PASSWORD
        }
    }

    try {
        const polybaseInstance = await startPolybase(config);
        console.log('Polybase started successfully with direct config object.');
        startServer(polybaseInstance);
    } catch (error) {
        console.error('Error starting Polybase with direct config:', error);
    }

    // const resulta = await find(
    //     'mongo',
    //     'polybase_mongo_collection',
    //     { _id: '66dcc19369d2d12812633326' },
    //     'name'
    // );

    // console.log(resulta);


    // const resultb = await find(
    //     'redis',
    //     '',  // Redis doesn't use collectionName in this case
    //     'sample_bicycle:1001'
    // );
    // console.log(resultb);

    // const resultc = await find(
    //     'postgres',
    //     'polybase_postgres',
    //     { customer_id: 7 },
    //     'name'
    // );
    // console.log(resultc);

    // Test Polybase's find function directly using the static-interface.js
    async function testWithFindFunction() {
        try {
            // Assuming Polybase is already connected, call the find function directly
            const result = await find('mongo', 'polybase_mongo_collection', '_id="66dcc19369d2d12812633326"', 'name');
            console.log('Find result:', result);
        } catch (error) {
            console.error('Error executing find:', error);
        }
    }

    // Starts the Express server for monitoring Polybase status.
    function startServer(polybaseInstance) {
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'status.html'));
        });

        // Endpoint to get the status of database connections
        app.get('/status', (req, res) => {
            const databaseStates = Object.keys(polybaseInstance.dbInterfaces).map(dbType => {
                const dbInterface = polybaseInstance.dbInterfaces[dbType];
                return {
                    name: dbType,
                    connected: !!dbInterface,
                    status: dbInterface ? 'Connected' : 'Not connected'
                };
            });
            res.json(databaseStates);
        });

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }

}


const configPath = path.join(__dirname, 'Polybase-Config.json');

// Uncomment the function you want to test:

// 1. Create the configuration file:
// createConfigFile();

// 2. Test with the configuration file (after filling it in):
// testWithConfigFile();

// 3. Test with the direct configuration object:
testWithConfigObject();


// Neo4j Password: jecxapWBr9Zh2oOM988CLCvo5EN6b7FLFH65yNHl4vk