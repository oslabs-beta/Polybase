const express = require('express');
const mongoose = require('mongoose');
const redisClient = require('./config/redisConfig.js')
const mongoUser = require ('./models/mongoUser.js');
const connectDB = require('./config/mongoConfig');
const cors = require('cors');

const app = express();
const port = 3000;

// connect to mdb
connectDB();
app.use(cors());

app.use(express.json());

app.get('/mongo-users', async (req, res) => {
    try {
        const users = await mongoUser.find({});
        res.json(users);
    } catch(err) {
        res.status(500).json({ error: 'Failed to fetch users from MongDB'});
    }
});

app.get('/redis-leaderboard', async (req, res) => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const leaderboard = await redisClient.zRangeWithScores('userLeaderboard', 0, -1);
        res.json(leaderboard);
    } catch(err) {
        console.error('error fetching redis leaderboarrd', err);
        res.status(500).send("Server error");
    }
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

