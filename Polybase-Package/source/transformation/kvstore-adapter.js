/**
 * kvstore-adapter.js
 * 
 * Manages interactions with key-value stores, (MVP - Redis).
 * Handles basic key-value operations and more complex data structures.
 */


/**
 * Executes Redis key-value operations.
 * @param {Object} client - The Redis client object from the connection pool.
 * @param {String} operation - The Redis operation to be performed (e.g., 'get', 'set', 'del').
 * @param {Object} params - The parameters for the query, including the key, value (for set), and options.
 * @returns {Object} - The result of the Redis query.
 */
async function redisQuery(client, operation, params) {
    try {
        const { key, value, options } = params;
        let result;


        switch (operation) {
           // TODO: need to figure out how to specify key type - json, seet, etc. t 
          case 'get':
                result = await client.get(key);
                if (result) {
                    result = JSON.parse(result);  
                }
                break;
        case 'json.get':  //HANDLING WITH REDIS JSON
            result = await client.call('JSON.GET', key);  
            result = JSON.parse(result); 
            break;
            case 'set':
                result = await client.set(key, JSON.stringify(value), options);  //stromgofu
                break;
            case 'del':
                result = await client.del(key);
                break;
            case 'exists':
                result = await client.exists(key);
                break;
            case 'hset':
                result = await client.hset(key, ...value);  //ex for has hset? 
                break;
            case 'hget':
                result = await client.hget(key, options);  //get specific val 
                break;
            case 'incr':
                result = await client.incr(key);  //inc the value of a key
                break;
            case 'decr':
                result = await client.decr(key);  //dec the value of a key
                break;
            default:
                throw new Error(`Unsupported Redis operation: ${operation}`);
        }

        return result;
    } catch (error) {
        console.error('Redis query error:', error);
        throw new Error('Failed to execute Redis query');
    }
}

module.exports = { redisQuery };


