const express = require("express");
const router = express.Router();
const restaurantDetailsController = require("../controllers/restaurantDetailsController");

router.get("/:id", restaurantDetailsController.getRestaurantDetails);

module.exports = router;
