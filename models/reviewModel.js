const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate review with user ID
    name: String,
    stars: Number,
    reviewText: String,
    restaurantId: String,
    reviewImageUrls: [String],
    reviewVideoUrls: [String],
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Review", reviewSchema);
