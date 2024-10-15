const { startPolybase } = require('./presentation/init');
const { create } = require('./presentation/create-configFile');
const { find } = require('./presentation/static-Interface');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

/**
 * Creates a config file for Polybase
 */
async function createConfigFile() {
    // Create the config file using the create method
    create();

    // Notify the user
    console.log('Configuration file "Polybase-Config.json" created. \n 1. Fill in the configuration information for the databases you\'d like to connect');
}

/**
 * TEST Polybase with a configuration file after the user has filled it.
 */
async function testWithConfigFile() {
    try {
        // Check if the config file exists
        const configFilePath = path.resolve(process.cwd(), 'Polybase-Config.json');
        if (!fs.existsSync(configFilePath)) {
            throw new Error('Config file not found. Please create the config file first.');
        }

        // Check if the user has filled in the config (basic validation for placeholders)
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

/**
 * Test Polybase by passing the configuration object directly.
 */
async function testWithConfigObject() {
    const config = {
        mongo: {
            uri: 'mongodb+srv://davisknaub:l0JMb9PGVU0K3jvE@cluster-0.bbvjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-0',
            database: 'polybase_mongo'
        },
        postgres: {
            user: 'postgres.veodgvmkvklvxobkjrfh',
            host: 'aws-0-us-west-1.pooler.supabase.com',
            database: 'postgres',
            password: 'lukeiamyourfather',
            port: 5432
        },
        redis: {
            host: 'redis-13782.c329.us-east4-1.gce.redns.redis-cloud.com',
            port: 13782,
            username: 'default',
            password: 'D0UPgd4SyZKVyUv7uEwGyKc7Q5eJKl3V'
        },
        influx: {
            url: 'https://us-east-1-1.aws.cloud2.influxdata.com',
            token: 'oVd4p0TiPWtMPeIY9Tdhjulf1BUMf2GrlihlDeBUsV1Rj9egHGiHAkj4Pxstr5bFqveCGPvC32qwa0cJTALC5A==',
            org: 'Dev Testing',
            bucket: 'Influx-Sample-Buoy'
        }
    };

    try {
        const polybaseInstance = await startPolybase(config);
        console.log('Polybase started successfully with direct config object.');
        startServer(polybaseInstance);
    } catch (error) {
        console.error('Error starting Polybase with direct config:', error);
    }
    // async function find(dbType, collectionName, filter, projection) {
    // }mongo find polybase_mongo_collection _id="66dcc19369d2d12812633326" name

    const resulta = await find(
        'mongo',
        'polybase_mongo_collection',
        { _id: '66dcc19369d2d12812633326' },
        'name'
    );

    console.log(resulta);


    const resultb = await find(
        'redis',
        '',  // Redis doesn't use collectionName in this case
        'sample_bicycle:1001'
    );
    console.log(resultb);


    const resultc = await find(
        'postgres',
        'polybase_postgres',
        { customer_id: 7 },
        'name'
    );
    console.log(resultc);



    //   try {
    //     // Assuming Polybase is already connected, call the find function directly
    //     const result = await find('mongo', 'polybase_mongo_collection', '_id="66dcc19369d2d12812633326"', 'name');
    //     console.log('Find result:', result);
    // } catch (error) {
    //     console.error('Error executing find:', error);
    // }
}

/**
 * Test Polybase's find function directly using the static-interface.js.
 */
async function testWithFindFunction() {
    try {
        // Assuming Polybase is already connected, call the find function directly
        const result = await find('mongo', 'polybase_mongo_collection', '_id="66dcc19369d2d12812633326"', 'name');
        console.log('Find result:', result);
    } catch (error) {
        console.error('Error executing find:', error);
    }
}

/**
 * Starts the Express server for monitoring Polybase status.
 */
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

// Uncomment the function you want to test:

// 1. Create the configuration file:
// createConfigFile();

// 2. Test with the configuration file (after filling it in):
// testWithConfigFile();

// 3. Test with the direct configuration object:
testWithConfigObject();


