/*

- Manages transactions to ensure atomicity and consistency of operations across single or multiple databases.
- Handles transaction scopes: ensures all operations in a transaction are either completed successfully or rolled back.
- Manages commit/rollback logic to maintain data integrity.
- Recovers from transaction failures and ensures data remains consistent even in the case of errors.
- Supports multi-database transactions to coordinate operations across different database systems.

*/

function beginTransaction(db) {
    console.log(`Transaction started on ${db.name}`);
    db.startTransaction();
}

function commitTransaction(db) {
    console.log(`Transaction committed on ${db.name}`);
    db.commit();
}

function rollbackTransaction(db) {
    console.log(`Transaction rolled back on ${db.name}`);
    db.rollback();
}

function manageTransaction(operations, databases) {
    try {
        databases.forEach(db => beginTransaction(db));

        operations.forEach(operation => {
            console.log(`Executing operation: ${operation.description}`);
            operation.execute();
        });

        databases.forEach(db => commitTransaction(db));

        return { status: 'Transaction committed successfully' };
    } catch (error) {
        console.error(`Transaction failed: ${error.message}`);
        databases.forEach(db => rollbackTransaction(db));

        return { status: 'Transaction rolled back due to an error', error: error.message };
    }
}

module.exports = { manageTransaction };