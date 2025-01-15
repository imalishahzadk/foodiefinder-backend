const userModel = require("../models/userModel");
const pointsModel = require("../models/pointsModel");
const referralsModel = require("../models/referralsModel");
const getReferralLinkController = async (req, res) => {
    try {
      const userId = req.user._id; // Access the userId from the middleware's req.user
  
      if (!userId) {
        return res.status(400).send({ message: "User ID not found in request" });
      }
  
      // Generate the referral link
      const referralLink = `http://localhost:3000/register?referrerId=${userId}`;
  
      res.status(200).send({
        success: true,
        message: "Referral link generated successfully",
        referralLink,
      });
    } catch (error) {
      console.error("Referral Link Error:", error);
      res.status(500).send({ message: "Failed to generate referral link", error });
    }
  };


  module.exports = {
    getReferralLinkController,
  };
  