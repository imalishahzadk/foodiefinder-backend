const mongoose = require('mongoose');
require("dotenv").config();
const color = require("colors")
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://imalishahzadk:%40qwerty82313@foodiefinder.nvgas.mongodb.net/foodiefinder", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgWhite.black);
  } catch (err) {
    console.error(`Error in MongoDB: ${err.message}`.bgRed.white);
    process.exit(1);
  }
};

module.exports = connectDB;
