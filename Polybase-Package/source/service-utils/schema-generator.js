/*

 - Provides methods for fetching schema or metadata from various databases.
 - `getMongoSchema`: Retrieves schema from MongoDB by inspecting collections and sample documents.
 - `getPostgresSchema`: Fetches schema details from PostgreSQL using `information_schema` columns.
 - `getNeo4jMetadata`: Retrieves metadata from Neo4j, including labels and relationship types.
 - `getInfluxMeasurements`: Queries InfluxDB to retrieve measurements from a specified bucket.
 - `getRedisKeyspace`: Fetches all keys from Redis, representing the keyspace.
 - Logs successes and errors for each operation to facilitate debugging and system monitoring.

 */

const { logInfo, logError } = require('../service-utils/logging');

async function getMongoSchema(db) {
    try {
        const collections = await db.listCollections().toArray();
        const schema = {};

        for (let collection of collections) {
            const sampleDocument = await db.collection(collection.name).findOne();
            schema[collection.name] = sampleDocument ? Object.keys(sampleDocument) : 'Empty collection';
        }

        logInfo('Fetched MongoDB schema', { schema });
        return schema;
    } catch (error) {
        logError('Error fetching MongoDB schema', { error });
        throw new Error('Failed to fetch MongoDB schema');
    }
}

async function getPostgresSchema(client) {
    try {
        const result = await client.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public';
        `);

        const schema = result.rows.reduce((acc, row) => {
            if (!acc[row.table_name]) {
                acc[row.table_name] = [];
            }
            acc[row.table_name].push({ column: row.column_name, type: row.data_type });
            return acc;
        }, {});

        logInfo('Fetched PostgreSQL schema', { schema });
        return schema;
    } catch (error) {
        logError('Error fetching PostgreSQL schema', { error });
        throw new Error('Failed to fetch PostgreSQL schema');
    }
}

async function getNeo4jMetadata(driver) {
    const session = driver.session();

    try {
        const labelsResult = await session.run('CALL db.labels();');
        const relationshipsResult = await session.run('CALL db.relationshipTypes();');

        const labels = labelsResult.records.map(record => record.get('label'));
        const relationships = relationshipsResult.records.map(record => record.get('relationshipType'));

        const schema = { labels, relationships };

        logInfo('Fetched Neo4j metadata', { schema });
        return schema;
    } catch (error) {
        logError('Error fetching Neo4j metadata', { error });
        throw new Error('Failed to fetch Neo4j metadata');
    } finally {
        await session.close();
    }
}

async function getInfluxMeasurements(influxDB, bucket, org) {
    try {
        const queryApi = influxDB.getQueryApi(org);
        const query = `import "influxdata/influxdb/v1"
                       v1.measurements(bucket: "${bucket}")`;

        const result = [];

        await queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                result.push(o._value);
            },
            error(error) {
                logError('Error fetching InfluxDB measurements', { error });
                throw new Error('Failed to fetch InfluxDB measurements');
            },
            complete() {
                logInfo('Fetched InfluxDB measurements', { result });
            }
        });

        return result;

    } catch (error) {
        logError('Error fetching InfluxDB measurements', { error });
        throw new Error('Failed to fetch InfluxDB measurements');
    }
}

async function getRedisKeyspace(redis) {
    try {
        const keys = await redis.keys('*');
        logInfo('Fetched Redis keyspace', { keys });
        return keys;
    } catch (error) {
        logError('Error fetching Redis keyspace', { error });
        throw new Error('Failed to fetch Redis keyspace');
    }
}

module.exports = { getInfluxMeasurements, getNeo4jMetadata, getPostgresSchema, getMongoSchema, getRedisKeyspace };
