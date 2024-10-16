const neo4j = require('neo4j-driver');

const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'polybase';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const neo4jSession = driver.session();

module.exports = neo4jSession;

