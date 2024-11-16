const supabaseClient = require("../config/supabaseClient.js");
const connectMongoDB = require("../config/mongoConfig.js");
const User = require("../models/mongoUser.js");

const populateMDB = async () => {
    await connectMongoDB();

    try {
        // fetch usernames from the psql db using supabase
        const { data: users, error } = await supabaseClient
        .from('users')
        .select('username');

        if (error) {
            throw error;
        }

        // insert each user into mdb
        for (let user of users) {
            await User.create({
                username: user.username,
            });
        }

        console.log("MDB successfully populated with supabase usernames");
    } catch (error) {
        console.error("Error populating MDB with supabase usernames:", error);
    }
};

populateMDB();

// node config/populateMongo.js
