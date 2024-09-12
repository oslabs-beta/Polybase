/**
 * This is a dummy file that users Polybase as if
 * you were a user --importing it as a package,
 * creating
 *  
 * */
const { initPolybase } = require('./presentation/init');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

//1 - USER PROVIDES CONFIGURATION OBJECT: 
//for each database they want to work with, they provide information about how polybase should 'connect' to each of them so that 
//the user doesn't do it itself
//immediately invoked function ---> as if user didn't exist
(async () => {
    //dummy funcy
    const config = {
        mongo: { uri: 'mongodb+srv://davisknaub:l0JMb9PGVU0K3jvE@cluster-0.bbvjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-0', database: 'polybase_mongo' },
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
            password: 'D0UPgd4SyZKVyUv7uEwGyKc7Q5eJKl3V',
        },
        neo4j: {
        uri: 'bolt://localhost:7687',
        username: 'polybase-neo4j',
        password: 'polybase'
        },
        influx: {
            url: 'https://us-east-1-1.aws.cloud2.influxdata.com',
            token: 'oVd4p0TiPWtMPeIY9Tdhjulf1BUMf2GrlihlDeBUsV1Rj9egHGiHAkj4Pxstr5bFqveCGPvC32qwa0cJTALC5A==',
            bucket: 'Influx-Sample-Buoy',
            org: 'Dev Testing'
        }
    };

    //init polybase (e.g. Polybase.conenct)
    const polybaseInstance = await initPolybase(config);

    //Remove before submit -- html page for vis
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'status.html'));
    });

    //catch status route
    app.get('/status', (req, res) => {
        const databaseStates = Object.keys(polybaseInstance.interfaces).map(dbType => {
            const dbInterface = polybaseInstance.interfaces[dbType];
            return {
                name: dbType,
                connected: !!dbInterface,
                status: dbInterface ? 'Connected' : 'Not connected'
            };
        });
        res.json(databaseStates); 
    });

app.get('/schemas', async (req, res) => {
    const schemas = {};

    // MongoDB schema retrieval
    if (polybaseInstance.interfaces.mongo) {
        const mongoDb = polybaseInstance.interfaces.mongo; // Assuming this is the correct database instance
        try {
            const collections = await mongoDb.listCollections().toArray(); // No need for `mongoDb.db`
            schemas.mongo = {};

            for (let collection of collections) {
                const sampleDocument = await mongoDb.collection(collection.name).findOne();
                schemas.mongo[collection.name] = sampleDocument ? Object.keys(sampleDocument) : 'Empty collection';
            }
        } catch (error) {
            console.error('Error fetching MongoDB schema:', error);
            res.status(500).json({ error: 'Failed to fetch MongoDB schema' });
            return;
        }
    }

    // PostgreSQL schema retrieval
    if (polybaseInstance.interfaces.postgres) {
        const postgresClient = polybaseInstance.interfaces.postgres;
        try {
            const result = await postgresClient.query(`
                SELECT table_name, column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public'
            `);
            schemas.postgres = result.rows.reduce((schema, row) => {
                if (!schema[row.table_name]) {
                    schema[row.table_name] = [];
                }
                schema[row.table_name].push({
                    column: row.column_name,
                    type: row.data_type
                });
                return schema;
            }, {});
        } catch (error) {
            console.error('Error fetching PostgreSQL schema:', error);
            res.status(500).json({ error: 'Failed to fetch PostgreSQL schema' });
            return;
        }
    }

    res.json(schemas); 
});

    //start express server
    app.listen(PORT, () => {
        console.log(`Status server running on http://localhost:${PORT}`);
    });

    //start up cli --again, dummy
    require('./presentation/cli-interface').cliInterface();

})();
const Polybase = require('./connect.js');

// // Configuration object provided by the user
// const config = {
//     mongo: {
//         uri: 'mongodb+srv://davisknaub:l0JMb9PGVU0K3jvE@cluster-0.bbvjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-0',
//         database: 'polybase_mongo'
//     },
//     postgres: {
//         user: 'postgres.veodgvmkvklvxobkjrfh',
//         host: 'aws-0-us-west-1.pooler.supabase.com',
//         database: 'postgres',
//         password: 'lukeiamyourfather',
//         port: 5432
//     },
//     redis: {
//         host: 'redis-13782.c329.us-east4-1.gce.redns.redis-cloud.com',
//         port: 13782,
//         username: 'default',
//         password: 'D0UPgd4SyZKVyUv7uEwGyKc7Q5eJKl3V',
//     },
//     neo4j: {
//         uri: 'bolt://localhost:7687',
//         username: 'polybase-neo4j',
//         password: 'polybase'
//     }, 
//      influx: {
//             url: 'https://us-east-1-1.aws.cloud2.influxdata.com',
//             token: 'oVd4p0TiPWtMPeIY9Tdhjulf1BUMf2GrlihlDeBUsV1Rj9egHGiHAkj4Pxstr5bFqveCGPvC32qwa0cJTALC5A==',
//             bucket: 'Influx-Sample-Buoy',
//             org: 'Dev Testing'
//         }
// };

// // Initialize Polybase by passing the config object
// Polybase.connect(config);
