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

module.exports = { getMongoSchema };


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

/**
 * Fetcjes all the measurements (in liu(lieu?) of schema he specified bucket.
 * @param {Object} influxDB - influxd client instance.
 * @param {String} bucket - bucket name 
 * @param {String} org - organization ID / name associ'd with the InfluxDB bucket.
 * @returns {Array} - List of measurements found in bucket
 */
async function getInfluxMeasurements(influxDB, bucket, org) {
    try {
        const queryApi = influxDB.getQueryApi(org);
        const query = `import "influxdata/influxdb/v1"
                       v1.measurements(bucket: "${bucket}")`;

        const result = [];
        
        /**
         * need to stream results of query since influx doesn't open cnxn
         */
        await queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                result.push(o._value); //extract  name
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
        const keys = await redis.keys('*'); //fetch all keys
        logInfo('Fetched Redis keyspace', { keys });
        return keys;
    } catch (error) {
        logError('Error fetching Redis keyspace', { error });
        throw new Error('Failed to fetch Redis keyspace');
    }
}


module.exports = { getInfluxMeasurements, getNeo4jMetadata, getPostgresSchema, getMongoSchema, getRedisKeyspace };
