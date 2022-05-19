const mongoose = require('mongoose')

const model = mongoose.Schema({
    username :{
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    facebookID: String,
    facebookAccessToken: String,
    facebookName: String,
});

module.exports = new mongoose.model("User", model , "users")