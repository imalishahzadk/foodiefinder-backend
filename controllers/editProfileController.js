const userModel = require("../models/userModel");

const editProfileController = async (req, res) => {
    try {
      const userId = req.user._id; // Extract user ID from the authenticated user
      const { name, email, address, phone } = req.body;
  
      // Validation
      if (!name || !email || !address || !phone) {
        return res.status(400).send({ message: "All fields are required" });
      }
  
      // Update user profile
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { name, email, address, phone },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
      }
  
      res.status(200).send({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating profile", error });
    }
  };

  module.exports = {
editProfileController
  };  