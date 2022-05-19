const mongoose = require('mongoose')

const fbModel = mongoose.Schema({
    facebookId:{
        type : String
    },
    name : {
        type : String
    },
    userId:{
        type : String
    }

    
});

module.exports = new mongoose.model("facebook", fbModel , "facebook")