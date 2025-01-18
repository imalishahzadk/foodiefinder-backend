const mongoose = require('mongoose');
require("dotenv").config();
const color = require("colors")
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgWhite.red);
  } catch (err) {
    console.error(`Error in MongoDB: ${err.message}`.bgRed.red);
    process.exit(1);
  }
};

module.exports = connectDB;
