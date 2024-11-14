const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  following: { type: [String], default: [] }, // arr of usernames
  followers: { type: [String], default: [] },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
