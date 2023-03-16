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
    role: {
        type: Number,
        enum : [0,1], // 0=> USER 1=> ADMIN  
        default: 0
    },
    stateId: {
        type: Number,
        enum : [0,1,2,3], // 0=> PENDING 1=> ACTIVE 2 => INACTIVE 3 =>DELETE 
        default: 0
    },

       

},
    {
        timestamps: true
    });
module.exports = mongoose.model('auth', authSchema)
