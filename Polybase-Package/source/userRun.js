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
        mongo: { uri: 'mongodb+srv://davisknaub:l0JMb9PGVU0K3jvE@cluster-0.bbvjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-0', database: 'listingsAndReviews' },
        // redis: { url: 'redis://localhost:6379' },
        // influxdb: { url: 'http://localhost:8086', token: 'yourToken' },
        postgres: {
            user: 'postgres.veodgvmkvklvxobkjrfh',
            host: 'aws-0-us-west-1.pooler.supabase.com',
            database: 'polybase_postgres',
            password: 'lukeiamyourfather',
            port: 6543
        }
    }
    // init Polybase w the user's config object
    const polybaseInstance = await initPolybase(config);

    //log intit interfaces
    console.log('Polybase initialized with interfaces:', polybaseInstance.interfaces);

    //dummy start cli 
    require('./presentation/cli-interface').cliInterface();

})();


// const config = {
//     postgres: {
//         user: 'postgres.veodgvmkvklvxobkjrfh',
//         host: 'aws-0-us-west-1.pooler.supabase.com',
//         database: 'polybase_postgres',
//         password: 'lukeiamyourfather',  
//         port: 6543
//     }
// };