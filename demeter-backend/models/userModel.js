const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            label: "username",
        },
        email: {
            type: String,
            required: true,
            label: "email",
        },
        password: {
            type: String,
            required: true,
            min: 8,
            label: "password",
        },
        dateOfCreation: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema)