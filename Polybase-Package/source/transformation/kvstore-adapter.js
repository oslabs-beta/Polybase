/**
 * kvstore-adapter.js
 * 
 * Manages interactions with key-value stores, (MVP - Redis).
 * Handles basic key-value operations and more complex data structures.
 */

const Redis = require('ioredis');
const redis = new Redis(); // Assumes Redis is running locally

/**
 * Executes basic key-value operations on Redis.
 * @param {String} command - The Redis command (e.g., "set", "get").
 * @param {Array} params - Parameters for the Redis command.
 * @returns {Promise} - The result of the Redis operation.
 */
async function executeKVOperation(command, ...params) {
    try {
        return await redis[command](...params);
    } catch (error) {
        console.error('KV Store Operation Error:', error);
        throw new Error('Failed to execute key-value store operation');
    }
}

module.exports = { executeKVOperation };