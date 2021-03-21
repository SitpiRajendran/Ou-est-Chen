const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //Profile Info.
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    finish: {
        type: Number,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;