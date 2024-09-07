/**
 * nosql-adapter.js
 * 
 * Handles operations specific to NoSQL databases, such as MongoDB.
 * Manages document-based queries, operations, and NoSQL-specific error handling.
 */

const { MongoClient } = require('mongodb');

// Create a MongoDB client
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Executes a MongoDB query.
 * @param {String} collectionName - The collection to query.
 * @param {Object} query - The query object.
 * @returns {Array} - The query result.
 */
async function executeNoSQLQuery(collectionName, query) {
    try {
        await client.connect();
        const db = client.db('yourDatabase');
        const collection = db.collection(collectionName);
        const result = await collection.find(query).toArray();
        return result;
    } catch (error) {
        console.error('NoSQL Query Execution Error:', error);
        throw new Error('Failed to execute NoSQL query');
    } finally {
        await client.close();
    }
}

module.exports = { executeNoSQLQuery };
