const path = require('path');
const fs = require('fs');
const dataset = require("../dataset.json");

// Controller for fetching all restaurants
exports.restaurantList = (req, res) => {
  res.json({
    success: true,
    data: dataset,
  });
};

// Controller for fetching a specific restaurant by `placeId`
exports.getRestaurantById = (req, res) => {
  const { placeId } = req.params;
  const restaurant = dataset.find((r) => r.placeId === placeId);

  if (!restaurant) {
    return res.status(404).json({ success: false, message: "Restaurant not found" });
  }

  res.json({ success: true, data: restaurant });
};

exports.incrementVisit = (req, res) => {
  const { placeId } = req.params;
  const restaurant = dataset.find((r) => r.placeId === placeId);

  if (!restaurant) {
    return res.status(404).json({ success: false, message: "Restaurant not found" });
  }

  restaurant.visits = (restaurant.visits || 0) + 1;

  const filePath = path.join(__dirname, "../dataset.json");
  fs.writeFileSync(filePath, JSON.stringify(dataset, null, 2));

  res.json({ success: true, data: restaurant });
};

exports.incrementVisitCount = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Find the restaurant and increment visit count
    const restaurant = await Restaurant.findOneAndUpdate(
      { placeId },
      { $inc: { visits: 1 } }, // Increment visits by 1
      { new: true } // Return updated document
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, visits: restaurant.visits });
  } catch (error) {
    console.error("Error incrementing visit count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.totalVisits = (req, res) => {
  const total = dataset.reduce((sum, restaurant) => sum + (restaurant.visits || 0), 0);

  res.json({ success: true, totalVisits: total });
};
