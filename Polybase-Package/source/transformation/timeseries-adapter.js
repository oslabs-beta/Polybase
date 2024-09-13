// /**
//  * timeseries-adapter.js
//  * 
//  * Interfaces with time-series databases, such as InfluxDB.
//  * Handles time-bound queries, data aggregation, and time-series-specific error handling.
//  */

// // const { InfluxDB } = require('@influxdata/influxdb-client'); 
// const { QueryAPI, QriteAPI, Point, InfluxDB} = require('@influxdata/influxdb-client');

// /**
//  * Handles InfluxDB operations like query, insert, and delete.
//  * @param {InfluxDB} influxDB - The InfluxDB client instance.
//  * @param {String} operation - The operation to be performed (e.g., 'query', 'insert', 'delete').
//  * @param {Object} params - The parameters for the query, including bucket, org, flux query, or data for insertion/deletion.
//  * @returns {Object} - The result of the InfluxDB operation.
//  */

// async function influxQuery(influxDB, operation, params) {
//     try {
//         const { bucket, org, fluxQuery, data  } = params; 
//         const queryAPI = influxDB.getQueryApi(org); 
//         const writeAPI = influxDB.getWriteApi(org, bucket); 

//         let result; 

//         switch (operation) {

//             // query 
//             case 'query': 
//                 result = []; 
//                 await queryAPI.queryRows(fluxQuery, {
//                     next(row, tableMeta) {
//                         const o = tableMeta.toObject(row);
//                         result.push(o);
//                     }, 
//                     error(error) {

//                         console.error('InfluxDB query error: ', error); 
//                         throw new Error('Failed to execute InfluxDB query');
//                     },
//                     complete() {
//                         console.log('Query completed');
//                     },
//                 });
//                 return result; 

//                 // insert 
//                 case 'insert': 
//                    const point = new Point('measurement')
//                    .tag('tagName', data.tagValue)
//                    .field('fieldKey', data.fieldValue)
//                    .timestamp(data.timestamp);
//                 writeAPI.writePoint(point);
//                 await writeAPI.flush();
//                 return { success: true, message: 'Data inserted successfully' };

//                 // update (technically an overwrite)
//                 case 'update': 
//                     const updatePoint = new Point('measurement')
//                     .tag('tagName', data.tagValue)
//                     .field('fieldKey', data.newFieldValue)
//                     .timestamp('data.timestamp')
//                 writeAPI.writePoint(updatePoint);
//                 await writeAPI.flush();
//                 return { success: true, message: 'Data updated successfully' };

//                 // delete 
//                 case 'delete':
//                     // Need an additional REST API call through different client (if necessary)

//                     throw new Error('Delete operation not supported directly in client library');
//                 default: 
//                     throw new Error(`Unsupported operation: ${operation}`);
//         }

//     } catch (error) {
//         console.error('InfluxDB operation error: ', error);
//         throw new Error('Failed to execute InfluxDB operation');
//     }
// }

// // To Update: Database interface file 
// // To Update: Data transformation file 

// /* 

// Measurement: A measurement in InfluxDB is like a table in traditional databases, 
// where time-stamped data points related to a specific topic or metric, like CPU usage, are stored.

// */


// /* Note: 

// Update Caveat: In InfluxDB, data points cannot be updated in the traditional sense. 
// "Updates" are simulated by overwriting existing points with new values using the same timestamp 
// and unique tag, effectively replacing the old data.

// Delete Caveat: InfluxDB does not support direct deletion of data points via the client library. 
// Instead, deletion is typically performed through a separate REST API, which requires specific 
// time range and measurement information to remove data.

// */


// module.exports = { influxQuery };

/**
 * influx-adapter.js
 * 
 * Manages interactions with InfluxDB, a time-series database.
 * Handles query execution and InfluxDB-specific operations such as writing data points,
 * querying time-series data, and managing buckets.
 */
const { Point, InfluxDB } = require('@influxdata/influxdb-client');
const { getState } = require('../service-utils/state-utils');

/**
 * Executes InfluxDB operations - query, write, delete
 * @param {Object} influxDB - The InfluxDB client object from the connection pool.
 * @param {String} operation - The operation to be performed (e.g., 'query', 'write', 'delete').
 * @param {Object} params - The parameters for the query, including measurement, tag, fields, and timestamp.
 * @returns {Object} - The result of the InfluxDB query or write operation.
 */
async function influxQuery(influxDB, operation, params) {
    try {
        const { measurement, tag, fields, timestamp, bucket, org, fluxQuery } = params;
        const queryApi = influxDB.getQueryApi(org); 
        const writeApi = influxDB.getWriteApi(org, bucket); 
        let result;

        switch (operation) {
            // Query Operation
            case 'query':
                result = [];
                await queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        const o = tableMeta.toObject(row);
                        result.push(o);
                    },
                    error(error) {
                        console.error('InfluxDB query error: ', error);
                        throw new Error('Failed to execute InfluxDB query');
                    },
                    complete() {
                        console.log('Query completed');
                    },
                });
                return result;

            // Write Operation
            case 'write':
                const point = new Point(measurement)
                    .tag(Object.keys(tag)[0], Object.values(tag)[0])
                    .field(Object.keys(fields)[0], Object.values(fields)[0])
                    .timestamp(timestamp || Date.now());
                writeApi.writePoint(point);
                await writeApi.flush();
                return { success: true, message: 'Data inserted successfully' };

            // Delete Operation (Note: Needs REST API call)
            case 'delete':
                throw new Error('Delete operation not supported directly in client library. Please use the InfluxDB Delete API.');
            
            default:
                throw new Error(`Unsupported InfluxDB operation: ${operation}`);
        }
    } catch (error) {
        console.error('InfluxDB operation error: ', error);
        throw new Error('Failed to execute InfluxDB operation');
    }
}


module.exports = { influxQuery };
