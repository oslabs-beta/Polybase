/**
 * data-transformation.js
 * 
 * manages data transformation to make sure data is compatible across diff 
 * databases. Applies the schema mapping rules and performs data conversions 
 * during synchronization or migration between databases w/ different models.
 */


/**
 * Transforms query data into the appropriate format for the database type.
 * @param {String} dbType - The type of the database (e.g., 'mongo', 'postgres', etc.)
 * @param {Object} data - The query data that needs to be transformed.
 * @returns {Object} - Transformed query ready for execution.
 */
function transformData(dbType, data) {
    // console.log('core/data-transformation | running transformData with: ', { dbType, data });

    let transformedQuery = {};

    //handling mongodb transformation
    if (dbType === 'mongo') {
        const collectionName = data[0]; //first element - collection name
        const filterString = data[1];   // sec element = filter string (e.g., _id="10069642")
        const projectionField = data[2]; // third element - projection (e.g., listing_url)
        const updateData = data[3]; // optional update data for insert/update ops

        //transform string to filter by ex (_id="10069642") into obj 
        let filter = {};
        if (filterString && filterString.includes('=')) {
            const [field, value] = filterString.split('=');
            filter[field] = value.replace(/"/g, '');
        }

    //create mongodb specifc transfomred query
    transformedQuery = {
            collectionName,
            filter,
            projection: projectionField ? { [projectionField]: 1, _id: 0 } : {}, //iprojection if neede
            updateData //including update data if user given
        };
    }


    // //
    // else if (dbType === 'postgres') {
    //     // Example transformation for PostgreSQL queries
    //     transformedQuery = `SELECT * FROM ${data[0]} WHERE ${data[1]};`; // Basic SQL example
    // }

    // console.log('Transformed query:', transformedQuery);
    return transformedQuery;
}

module.exports = { transformData };
