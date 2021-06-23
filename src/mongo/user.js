const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: String, // user name
    password: String,
});

const User = mongoose.model('User',UserSchema);
module.exports = User