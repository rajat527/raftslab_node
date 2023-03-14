const mongoose = require('mongoose')
const authSchema = new mongoose.Schema({

    first_name :{
        type : String
    },

    last_name :{
        type : String
    },

    email :{
        type : String
    },

    password :{
        type : String
    },

    token :{
        type : String
    }
      
},
{
    timestamps: true
});
module.exports =mongoose.model('auth',authSchema)
