const mongoose = require('mongoose');
//create a userschema model

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please provide the email'],
        unique:[true, 'email already exists'],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'please provide a valid email']
        
    },
    password: {
        type: String,
        required: [true, 'please provide the password'],
        trim: true,
        minlength: 6
    }
})

module.exports = mongoose.model('User', UserSchema)