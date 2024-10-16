const mongoose = require('mongoose');

const mongoURI = `mongodb+srv://imnathanpatterson:MdbPass@polybasetestenv.osavu.mongodb.net/?retryWrites=true&w=majority&appName=polybaseTestEnv`

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch(err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;