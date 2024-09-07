/**
 * timeseries-adapter.js
 * 
 * Interfaces with time-series databases, such as InfluxDB.
 * Handles time-bound queries, data aggregation, and time-series-specific error handling.
 */

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Create a client for InfluxDB
const influx = new InfluxDB({ url: 'http://localhost:8086', token: 'yourToken' });
const queryApi = influx.getQueryApi('yourOrg');
const writeApi = influx.getWriteApi('yourOrg', 'yourBucket');

/**
 * Executes a time-series query on InfluxDB.
 * @param {String} fluxQuery - The Flux query string.
 * @returns {Array} - The query result.
 */
async function executeTimeSeriesQuery(fluxQuery) {
    try {
        const result = [];
        await queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                result.push(o);
            },
            error(error) {
                console.error('Time Series Query Execution Error:', error);
                throw new Error('Failed to execute time-series query');
            },
            complete() {
                console.log('Query completed');
            },
        });
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Writes time-series data points to InfluxDB.
 * @param {String} measurement - The name of the measurement.
 * @param {Object} fields - The fields to write (key-value pairs).
 * @param {Object} tags - The tags to associate with the data point.
 */
async function writeTimeSeriesData(measurement, fields, tags) {
    try {
        const point = new Point(measurement);
        Object.keys(fields).forEach(key => point.floatField(key, fields[key]));
        Object.keys(tags).forEach(key => point.tag(key, tags[key]));
        writeApi.writePoint(point);
        await writeApi.close();
        console.log('Time-series data written successfully');
    } catch (error) {
        console.error('Time Series Write Error:', error);
        throw new Error('Failed to write time-series data');
    }
}

module.exports = { executeTimeSeriesQuery, writeTimeSeriesData };