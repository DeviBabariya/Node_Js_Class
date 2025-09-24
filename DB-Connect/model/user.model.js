const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname : String,
    lastname :{
        type: String
    },
    email :{
        type: String
    },
    password :{
        type: String
    },
    mobileNo :{
        type: Number
    },
    gender :{
        type: String,
        enum: ['Male' , 'Female']
    },
    profile :{
        type: String,
    }
});
module.exports = mongoose.model('User',userSchema);