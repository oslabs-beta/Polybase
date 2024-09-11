const redisClient = require("../config/redisConfig");
const User = require("../models/mongoUser.js");
const connectMongoDB = require("../config/mongoConfig.js");

const updateRedisLeaderboard = async () => {
  try {
    // fetch mdb users
    connectMongoDB();

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const users = await User.find();

    // iterate over users
    for (const user of users) {
      const followerCount = user.followers.length;

      // store user and follower count in redis
      await redisClient.zAdd("userLeaderboard", {
        score: followerCount, 
        value: user.username,
      });
    }

    console.log("Leaderboard updated in redis");

    // retrieve and log the leaderboard from redis
    const leaderboard = await redisClient.zRangeWithScores('userLeaderboard", 0, -1');

    console.log('Current redis leaderboard:');
    leaderboard.forEach((entry, index) => {
      console.log(`${index + 1}, ${entry.value} - ${entry.score} followers`);
    })

    redisClient.quit();

  } catch (err) {
    console.error("Error upduating redis leaderboard:", err);
  }
};

updateRedisLeaderboard();
