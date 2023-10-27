/* eslint-disable no-undef */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        email: String,
		password: String
    },
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;