/* 
    Will utilize batch processing in this simple environment in order 
    to have a reference when we implement it in final product

    1. define batch processing function that takes many users and creates 
       relationships in neo4j
    2. iterate over the mdb users and divide them into batches
    3. process each batch

    * We know the dataset for the test environment is small, in a more 
    pragmatic environment, we can increase batch size. For the test 
    environment, we keep it at 2*
*/

const connectMongoDB = require("../config/mongoConfig.js");
const neo4jSession = require("../config/neo4jConfig.js");
const User = require("../models/mongoUser.js");

const BATCH_SIZE = 2;

// PROCESS BATCH OF USERS
const processBatch = async (usersBatch) => {
  // begin new transaction in neo4j to ensure either ALL or NONE of the operations within them are executed
  const transaction = neo4jSession.beginTransaction();
  
  try {
    // create the user as a node if it doesnt already exist
    for (let user of usersBatch) {
      console.log(user);
      await transaction.run("MERGE (u:User {username: $username})", {
        username: user.username,
      });

      // create the users relationships
      for (let followingUser of user.following) {
        await transaction.run(
          // find the user AND the following user, then create a FOLLOWS relationship
          "MATCH (u:User {username: $username}), (f:User {username: $followingUsername}) " +
            "MERGE (u)-[:FOLLOWS]->(f)",
          { username: user.username, followingUsername: followingUser }
        );
      }

      // create follower relationships
      for (let followerUser of user.followers) {
        await transaction.run(
          // find the user AND the follower user, then create a FOLLOWS relationship
          "MATCH (u:User {username: $username}), (f:User {username: $followerUsername}) " +
            "MERGE (f)-[:FOLLOWS]->(u)",
          { username: user.username, followerUsername: followerUser }
        );
      }
    }
    // if all queries withing the transaction are successful, the transaction is committed
    await transaction.commit();
    console.log(`Batch processed: ${usersBatch.length} users`);
  } catch (err) {
    // if error, transaction is rolled back to maintain data integrity and ensure no partial changes are applied
    await transaction.rollback();
    console.error("Error processing batch:", err);
  } finally {
    // ensure transaction is closed
    transaction.close();
  }
};

// POPULATE Neo4j function
const populateNeo4j = async () => {
  await connectMongoDB();

  try {
    // fetch all users from mdb
    const users = await User.find();

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const usersBatch = users.slice(i, i + BATCH_SIZE);
      await processBatch(usersBatch);
    }

    console.log("NEo4j successfully populated with relationships.");
  } catch (err) {
    console.error("Error populating Neo4j:", err);
  } finally {
    await neo4jSession.close();
  }
};

populateNeo4j();
