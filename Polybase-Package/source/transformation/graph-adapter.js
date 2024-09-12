/**
 * graph-adapter.js
 * 
 * Manages connectivity and operations for graph databases, such as Neo4j.
 * Handles graph traversal, query execution, and graph-specific error handling.
 */


const { getState } = require('../service-utils/state-utils');

/**
 * executes Neo4j operations currently : MATCH, CREATE, UPDATE, DELETE
 * @param {Object} session neo4j session object 
 * @param {String} operation operation to be performed (e.g., 'match', 'create', 'update', 'delete').
 * @param {Object} params params for the query, including label, conditions, and update data.
 * @returns {Object} the result of the Neo4j query.
 */
async function neo4jQuery(session, operation, params) {
    try {
        const { label, whereClause, fields, updateData } = params;
        let cypherQuery;
        let result;

        switch (operation) {
            case 'match':
                const fieldsToReturn = fields.includes('*') ? 'n' : fields.join(', ');

                
                cypherQuery = `MATCH (n:${label}) WHERE ${whereClause} RETURN ${fieldsToReturn};`;
                result = await session.run(cypherQuery);
                break;

            case 'create':
                const createProps = Object.entries(updateData)
                    .map(([key, value]) => `${key}: '${value}'`).join(', ');
                cypherQuery = `CREATE (n:${label} { ${createProps} }) RETURN n;`;
                result = await session.run(cypherQuery);
                break;

            case 'update':
                const setClause = Object.entries(updateData)
                    .map(([key, value]) => `n.${key} = '${value}'`).join(', ');
                cypherQuery = `MATCH (n:${label}) WHERE ${whereClause} SET ${setClause} RETURN n;`;
                result = await session.run(cypherQuery);
                break;

            case 'delete':
                cypherQuery = `MATCH (n:${label}) WHERE ${whereClause} DELETE n;`;
                result = await session.run(cypherQuery);
                break;

            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return result.records.map(record => record.get('n').properties);
    } catch (error) {
        console.error('Neo4j query error:', error);
        throw new Error('Failed to execute Neo4j query');
    }
}


module.exports = { neo4jQuery };
