/**
 * nosql-adapter.js
 * 
 * Handles operations specific to NoSQL databases, such as MongoDB.
 * Manages document-based queries, operations, and NoSQL-specific error handling.
 */

/**
/**
 * Handles MongoDB operations like find, insert, update, delete.
 * @param {Object} db - The MongoDB database object.
 * @param {String} operation - The operation to be performed (e.g., 'find', 'insert', etc.).
 * @param {Object} params - The parameters for the query, including collection name, filter, projection, and update data.
 * @returns {Object} - The result of the MongoDB query.
 */
async function mongoQuery(db, operation, params) {
    try {
        //destructuring the transformed params object
        const { collectionName, filter, projection, updateData } = params;

        const collection = db.collection(collectionName);
        
        let result; 

        switch (operation) {
            case 'find':
                result = await collection.find(filter || {}).project(projection || {}).toArray();
                return result;
            case 'insert':
                result = await collection.insertOne(updateData);
                return result;
            case 'update':
                result = await collection.updateOne(filter, { $set: updateData });
                return result;
            case 'delete':
                result = await collection.deleteOne(filter);
                return result;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
    } catch (error) {
        console.error('MongoDB query error:', error);
        throw new Error('Failed to execute MongoDB query');
    }
}

module.exports = { mongoQuery };
