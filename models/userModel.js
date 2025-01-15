const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // trims any whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    favorites: {
        type: [String], // Array of restaurant IDs
        default: [],
    },
    lastActivity: { type: Date, default: Date.now }, // New field

}, { timestamps: true }); // time will be added when new user comes.

module.exports = mongoose.model("users", userSchema);
