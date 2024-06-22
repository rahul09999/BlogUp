const {Schema, Model, model} = require('mongoose');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,

    },
    profileImage: {
        type: String,
        path: "./images/avatar.avif",
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER",
    }
}, {timestamps: true});

const User = model('user', userSchema);

module.exports = User;

