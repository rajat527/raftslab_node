const mongoose = require('mongoose')
const authSchema = new mongoose.Schema({

    first_name: {
        type: String
    },

    last_name: {
        type: String
    },

    full_name: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    token: {
        type: String
    },
    stateId: {
        type: String,
        enum : [0,1,2,3], // 0=> PENDING 1=> ACTIVE 2 => INACTIVE 3 =>DELETE 
        default: 0
    },

       

},
    {
        timestamps: true
    });
module.exports = mongoose.model('auth', authSchema)
