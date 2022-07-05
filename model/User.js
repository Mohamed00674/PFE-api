const mongoose = require("mongoose");
const model = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  facebookID: String,
  facebookAccessToken: String,
  facebookName: String,
  facebookLastName: String,
  twitterName: String,
  twitterAccessToken: String,
  twitterImage: String,
  linkedinName: String,
  linkedinId: String,
  linkedinAccessToken: String,
  linkedProfilePhoto: String,
});
module.exports = new mongoose.model("User", model, "users");
