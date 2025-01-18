const express = require("express");
const app = express();
const PORT = 8000;
const db = require("./config/db");
const bodyParser = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();
// const { suggestRestaurants } = require('./controllers/reviewController');

const restaurantRoute = require("./routes/restaurantRoute");
// const restaurantRoute = require("./routes/restaurantDetailsRoute");
const authRoute = require("./routes/authRoute");
const reviewRoutes = require('./routes/reviewRoute');

// Database connection
db();

const corsOptions = {
  origin: "https://polite-meadow-000f8b800.4.azurestaticapps.net", // Allow only this origin
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));

// Middleware
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant API! Explore our endpoints to discover more.");
});

// Use Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1", restaurantRoute);
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', require('./routes/favoriteRoute'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`.bgBlack.yellow, "\n");
});
