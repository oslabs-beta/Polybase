/**
 * This is a dummy file that users Polybase as if
 * you were a user --importing it as a package,
 * creating
 *  
 * */
const { initPolybase, } = require('./presentation/init'); 

//imm invoked func to sim user
(async () => {
    //user passes in configuraiton object
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

    // init Polybase w the user's config object
    const polybaseInstance = await initPolybase(config);

    //log intit interfaces
    console.log('Polybase initialized with interfaces:', polybaseInstance.interfaces);

    //dummy start cli 
    require('./presentation/cli-interface').cliInterface();

})();
