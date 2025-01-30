const mongoose = require("mongoose");

const newReviewSchema = new mongoose.Schema(
    {
        locationName: {
            type: String,
            required: true,
            label: "locationName",
        },
        username: {
            type: String,
            required: true,
            label: "username",
        },
        discription: {
            type: String,
            required: true,
            label: "discription",
        },
        rating: {
            type: Number,
            required: true,
            max: 5,
            min: 1,
            label: "address",
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "reviews" }
);

module.exports = mongoose.model('reviews', newReviewSchema)