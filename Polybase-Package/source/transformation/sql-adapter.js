/**
 * sql-adapter.js
 * 
 * Manages interactions with SQL-based databases, such as PostgreSQL.
 * Handles connection management, query execution, and SQL-specific error handling.
 */

const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: 'username',
    host: 'localhost',
    database: 'yourDatabase',
    password: 'password',
    port: 5432,
});

/**
 * Executes a SQL query.
 * @param {String} query - The SQL query to execute.
 * @param {Array} params - The query parameters.
 * @returns {Array} - The query result.
 */
async function executeSQLQuery(query, params = []) {
    try {
        const client = await pool.connect();
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('SQL Query Execution Error:', error);
        throw new Error('Failed to execute SQL query');
    } finally {
        client.release();
    }
}

module.exports = { executeSQLQuery };