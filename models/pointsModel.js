const mongoose = require("mongoose");

const pointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("points", pointsSchema);
