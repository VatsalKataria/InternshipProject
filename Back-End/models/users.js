const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Username: String,
    emailAdd: String,
    ECode: String,
    Password: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

const UserModel = mongoose.model('registerUsers', UserSchema)
module.exports = UserModel