/*

- Manages Data Transformation: Ensures that data formats are compatible when synchronizing or migrating across different types of databases.
- Schema Mapping & Data Conversion: Applies schema mapping and handles data conversion for specific database types like MongoDB, PostgreSQL, Redis, Neo4j, and InfluxDB.
- Transforms Queries: Converts input data into a format suitable for each database type, including query filters, projections, and update operations.
- Supports Multiple Databases: Handles MongoDB collections, PostgreSQL tables, Redis keys, Neo4j nodes, and InfluxDB measurements.

*/

function transformData(dbType, data) {

    let transformedQuery = {};

    if (dbType === 'mongo') {
        const collectionName = data[0];
        const filterString = data[1];
        const projectionField = data[2];
        const updateData = data[3];

        let filter = {};

        if (filterString && filterString.includes('=')) {
            const [field, value] = filterString.split('=');
            filter[field] = value.replace(/"/g, '');
        }

        transformedQuery = {
            collectionName,
            filter,
            projection: projectionField ? { [projectionField]: 1, _id: 0 } : {},
            updateData
        };

    } else if (dbType === 'postgres') {
        const tableName = data[0];
        const condition = data[1];
        const fields = data[2] ? data[2].split(',') : ['*'];
        const updateData = data[3];

        transformedQuery = { tableName, condition, fields, updateData };

    } else if (dbType === 'redis') {
        const key = data[0];
        const value = data[1];
        transformedQuery = { key, value };

        console.log(transformedQuery);

    } else if (dbType === 'neo4j') {
        const label = data[0];
        const condition = data[1];
        const fields = data[2] ? data[2].split(',') : ['*'];
        const updateData = data[3];

        let whereClause = '';
        if (condition && condition.includes('=')) {
            const [field, value] = condition.split('=');
            whereClause = `n.${field} = '${value.replace(/"/g, '')}'`;
        }

        transformedQuery = { label, whereClause, fields, updateData };

    } else if (dbType === 'influx') {
        const measurement = data[0];
        const tagKey = data[1];
        const tagValue = data[2];
        const fieldKey = data[3];
        const fieldValue = data[4];
        const timestamp = data[5];
        const range = data[6];

        transformedQuery = {
            measurement,
            tag: {
                [tagKey]: tagValue
            },
            fields: {
                [fieldKey]: fieldValue
            },
            timestamp: timestamp || Date.now(),
            range: range || '-1h'
        };
    }

    return transformedQuery;
}

module.exports = { transformData };