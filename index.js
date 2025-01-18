const express = require("express");
const app = express();
const PORT = 8000;
const db = require("./config/db");
const bodyParser = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

// Routes
const restaurantRoute = require("./routes/restaurantRoute");
const authRoute = require("./routes/authRoute");
const reviewRoutes = require('./routes/reviewRoute');

// Database connection
db();

app.use(
  cors({
    origin: 'https://foodfiner.netlify.app/', // Replace with your Netlify URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
    credentials: true, // Enable cookies if needed
  })
);

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
  console.log(`Server is running on http://localhost:${PORT}`);
});
