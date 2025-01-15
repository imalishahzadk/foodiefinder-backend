const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Existing routes
router.get("/restaurants", restaurantController.restaurantList);
router.get("/restaurants/:placeId", restaurantController.getRestaurantById);

// New routes for visit tracking
router.post("/restaurants/:placeId/visit", restaurantController.incrementVisit); // Increment visits
router.get("/restaurants/visits/total", restaurantController.totalVisits); // Total visits count

// New route to get the user's total visit count
// router.get("/user/visits", restaurantController.getUserVisitCount);  // Get current user's visits

module.exports = router;
