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

//immediately invoked function ---> as if user didn't exist
(async () => {
    //dummy funcy
    const config = {
        mongo: { uri: 'mongodb+srv://davisknaub:l0JMb9PGVU0K3jvE@cluster-0.bbvjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-0', database: 'listingsAndReviews' },
        postgres: {
            user: 'postgres.veodgvmkvklvxobkjrfh',
            host: 'aws-0-us-west-1.pooler.supabase.com',
            database: 'polybase_postgres',
            password: 'lukeiamyourfather',
            port: 6543
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

    //temporary: getting schemas from mongo and posetgres 
    app.get('/schemas', async (req, res) => {
        const schemas = {};

        //
        if (polybaseInstance.interfaces.mongo) {
            const mongoDb = polybaseInstance.interfaces.mongo;
            const collections = await mongoDb.db.listCollections().toArray();
            schemas.mongo = {};

            for (let collection of collections) {
                const sampleDocument = await mongoDb.db.collection(collection.name).findOne();
                schemas.mongo[collection.name] = sampleDocument ? Object.keys(sampleDocument) : 'Empty collection';
            }
        }

    
        if (polybaseInstance.interfaces.postgres) {
            const postgresClient = polybaseInstance.interfaces.postgres;
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
