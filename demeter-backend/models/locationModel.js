const mongoose = require("mongoose");

const newLocationSchema = new mongoose.Schema(
    {
        locationName: {
            type: String,
            required: true,
            label: "locationName",
        },
        username: { //User that creates the location
            type: String,
            required: true,
            label: "userID",
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
    },
    { collection: "locations" }
);

module.exports = mongoose.model('locations', newLocationSchema)