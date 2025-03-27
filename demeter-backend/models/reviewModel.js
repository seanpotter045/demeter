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
    description: {
      type: String,
      required: true,
      label: "description",
    },
    rating: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
      label: "rating",
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "reviews" }
);

module.exports = mongoose.model('reviews', newReviewSchema);
