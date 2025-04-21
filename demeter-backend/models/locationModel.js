const mongoose = require("mongoose");

const newLocationSchema = new mongoose.Schema(
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
        locationType: {
            type: String,
            required: true,
            label: "locationType",
        },
        address: {
            type: String,
            required: true,
            label: "address",
        },
        description: {
            type: String,
            required: true,
            label: "description",
        },
    },
    { 
        collection: "locations",
        timestamps: true
    }
);

module.exports = mongoose.model('locations', newLocationSchema);
