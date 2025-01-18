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

// Enable CORS for the specific frontend URL
app.use(
  cors({
    origin: 'https://build-ten-chi.vercel.app/', // Allow the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Add any other headers your app uses
    credentials: true, // Enable cookies if needed
  })
);

// Optionally, handle preflight requests explicitly:
app.options('*', cors());

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
