const userModel = require("../models/userModel");
const pointsModel = require("../models/pointsModel");
const referralsModel = require("../models/referralsModel");
// Get User Points
const getUserPointsController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated and userId is available

    // Fetch points from pointsModel
    const userPoints = await pointsModel.findOne({ userId });
    if (!userPoints) {
      return res.status(404).send({ message: "User points not found" });
    }

    res.status(200).send({
      success: true,
      points: userPoints.points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch points", error });
  }
};


module.exports = {
    getUserPointsController
  };
  