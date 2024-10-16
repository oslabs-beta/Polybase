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
 * - collectionName: name of the MongoDB collection to operate on. 
 * - filter: query filter to apply (for 'find', 'update', etc)
 * - projection: fields to return for a find query s
 * - updateData: data to insert or update in the documents
 * @returns {Object} - The result of the MongoDB query.
 */
async function mongoQuery(db, operation, params) {
    try {
        //destructure params object to extract values for collection name, query filters,
        //field proejctions, and update data --to be used in MongoDB
        const { collectionName, filter, projection, updateData } = params;

        //get the collection from the mongodb -- all ops will be performed on this collection
        const collection = db.collection(collectionName);

        //init variable to hold the result of database op
        let result;

        //determine operation type base on the operation param and execute the corresponding mongodb action
        switch (operation) {
            case 'find':
                //perform find -- apply filter/proejction as needed
                //convert cursor to an array and return the result
                result = await collection.find(filter || {}).project(projection || {}).toArray();
                return result;

            case 'insert':
                //perform insert operation, inserting single docyument based on the updateData
                // return the result of the insertion which includess insertID and other metadata
                result = await collection.insertOne(updateData);
                return result;

            case 'update':
                //perform update operation, updating first doc that matches filter
                //the $set operator is used to update
                result = await collection.updateOne(filter, { $set: updateData });
                return result;

            case 'delete':
                //perform delete operation, deleting a single document that matches to filter
                //return the result of the delet operation
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
