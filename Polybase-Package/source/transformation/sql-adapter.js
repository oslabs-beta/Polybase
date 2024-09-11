/**
 * sql-adapter.js
 * 
 * Manages interactions with SQL-based databases, such as PostgreSQL.
 * Handles connection management, query execution, and SQL-specific error handling.
 */

const { getState } = require('../service-utils/state-utils');

/**
 * Handles PostgreSQL operations - SELECT, INSERT, UPDATE, DELETE
 * @param {Object} client - The PostgreSQL client object from the connection pool.
 * @param {String} operation - The operation to be performed (e.g., 'select', 'insert', etc.).
 * @param {Object} params - The parameters for the query, including table name, conditions, and update data.
 * @returns {Object} - The result of the PostgreSQL query.
 */
async function postgresQuery(client, operation, params) {
    try {
        const { tableName, condition, fields, updateData } = params;
        let queryText;
        let values;

        switch (operation) {
            case 'select':
                //generate the  SELECT query w/ conditions, fields, etc
                queryText = `SELECT ${fields.join(', ')} FROM ${tableName} WHERE ${condition};`;
                break;
            case 'insert':
                const columns = Object.keys(updateData).join(', ');
                const placeholders = Object.keys(updateData).map((_, i) => `$${i + 1}`).join(', ');
                values = Object.values(updateData);
                queryText = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`;
                break;
            case 'update':
                const setString = Object.keys(updateData).map((key, i) => `${key}=$${i + 1}`).join(', ');
                values = Object.values(updateData);
                queryText = `UPDATE ${tableName} SET ${setString} WHERE ${condition} RETURNING *;`;
                break;
            case 'delete':
                queryText = `DELETE FROM ${tableName} WHERE ${condition} RETURNING *;`;
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        const result = await client.query(queryText, values);
        return result.rows; 
    } catch (error) {
        console.error('PostgreSQL query error:', error);
        throw new Error('Failed to execute PostgreSQL query');
    }
}

module.exports = { postgresQuery };
