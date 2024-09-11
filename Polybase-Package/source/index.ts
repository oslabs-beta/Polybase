/**
 * Structure of NPM Package:
 *
 * Polybase program encapsulated in modules that we
 * then expose through default entrypoint - index.js
 * 
 * 
 */

/**
 * Need to provide methods that users can call after they install Polybase
 */

/**
 * Expose Polybase for users to interact with by taking some configuration object
 * and kicking off initializaiton, setup, etc
 * 
 *  
 */



/**
 * Example User
 * const Polybase = require('polybase');

//immediately envoked func
(async () => {
    
    //users config object --example from Nathan's MVP dopc
    const config = {
        mongo: { uri: 'mongodb://localhost:27017', database: 'test' },
        redis: { url: 'redis://localhost:6379' },
        influxdb: { url: 'http://localhost:8086', token: 'yourToken' },
        postgres: {
            user: 'davis',
            host: 'localhost',
            database: 'chaseBankAllUsersCash',
            password: 'cas$hmoney',
            port: 5432
        }
    };

    //User needs to know that they have to pass in objet like this currently
    const polybase = new Polybase(config);

    //and also something to actually get it to "run"
    await polybase.initialize();

    //Then should be able to query
    const result = await polybase.query('mongo', {
        operation: 'find',
        params: ['users', { name: 'John Doe' }]
    });

})();

 */