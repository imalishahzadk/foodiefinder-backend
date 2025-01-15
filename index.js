const express = require("express");
const app = express();
const PORT = 8000;
const dataset = require("./dataset.json");
const db = require("./config/db");
const bodyParser = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const { suggestRestaurants } = require('./controllers/reviewController');


const restaurantRoute = require("./routes/restaurantRoute");
// const restaurantRoute = require("./routes/restaurantDetailsRoute");
const authRoute = require("./routes/authRoute");
const reviewRoutes = require('./routes/reviewRoute');

// Database connection
db();

const corsOptions = {
  origin: "http://localhost:3000", // Allow only this origin
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));


// Middleware
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1", restaurantRoute);
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', require('./routes/favoriteRoute'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});



(async () => {
    try {
        // Mock response to capture the output
        const mockResponse = {
            json: (output) => console.log('Suggested Restaurants:', output),
            status: (statusCode) => ({
                json: (output) => console.log(`Status ${statusCode}:`, output),
            }),
        };

        // Call the function
        console.log('Testing suggestRestaurants...');
        await suggestRestaurants({}, mockResponse);
    } catch (error) {
        console.error('Error testing suggestRestaurants:', error);
    }
})();

app.use(express.static("./frontend/build"))
app.get("*", (req, res)=>{
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});