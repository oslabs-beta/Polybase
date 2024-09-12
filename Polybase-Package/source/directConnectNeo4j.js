// const neo4j = require('neo4j-driver');

// const driver = neo4j.driver(
//     'bolt://localhost:7687',
//     neo4j.auth.basic('polybase-neo4j', 'polybase')
// );

// async function testConnection() {
//     try {
//         const session = driver.session();
//         await session.run('RETURN 1');
//         console.log('✔ Connection to Neo4j established.');
//         await session.close();
//     } catch (error) {
//         console.error('Neo4j connection failed:', error);
//     } finally {
//         await driver.close();
//     }
// }

// testConnection();
