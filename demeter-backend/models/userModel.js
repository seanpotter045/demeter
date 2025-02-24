const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const newUserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,  // Ensure username is unique
            label: "username",
        },
        email: {
            type: String,
            required: true,
            unique: true,  // Ensure email is unique
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

// Hash the password before saving the user
newUserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10); // Generate salt
            this.password = await bcrypt.hash(this.password, salt); // Hash the password
            next();
        } catch (err) {
            next(err); // Pass any error to the next middleware
        }
    } else {
        next();
    }
});

// Compare entered password with the hashed password in the database
newUserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', newUserSchema);
