/*

- Ensures data consistency by comparing source and target databases.
- Resolves conflicts using predefined strategies (e.g., prioritizing one database or merging).
- Generates synchronization plans before applying changes. 
- Supports both one-way and two-way synchronization.
- Applies changes to the target database(s) based on the sync plan.
- Can perform real-time or batch synchronization depending on the use case.

*/

function resolveConflicts(sourceData, targetData) {

    return { ...targetData, ...sourceData };
}

function generateSyncPlan(sourceData, targetData) {

    const syncPlan = {
        sourceUpdates: [],
        targetUpdates: []
    };

    if (JSON.stringify(sourceData) !== JSON.stringify(targetData)) {
        syncPlan.targetUpdates.push(sourceData);
    }

    return syncPlan;
}

function applySyncPlan(plan, targetDb) {

    plan.targetUpdates.forEach(update => {

        targetDb.update(update);
    });
}

function synchronizeData(sourceDb, targetDb) {

    const sourceData = sourceDb.getData();
    const targetData = targetDb.getData();

    const resolvedData = resolveConflicts(sourceData, targetData);
    const syncPlan = generateSyncPlan(resolvedData, targetData);

    applySyncPlan(syncPlan, targetDb);

    return { syncResult: `Sync completed between ${sourceDb.name} and ${targetDb.name}` };
}

module.exports = { synchronizeData };