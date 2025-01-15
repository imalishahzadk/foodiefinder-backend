const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


const requireSignIn = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Extract the token
    //   console.log("Extracted Token:", token); // Log the token for debugging
  
      const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify with secret
      req.user = decode; // Attach decoded payload to req.user
      next();
    } catch (error) {
      console.log("JWT Error:", error.message);
      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
// admin access


const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 1) {
            console.log("Role in isAdmin:", req.user.role);

            return res.status(401).json({ success: false, message: "Unauthorized Access" });
        }
        next();
    } catch (error) {
        console.error("Error in Admin Middleware:", error);
        res.status(401).json({ success: false, message: "Error in Admin Middleware" });
    }
};


module.exports = { requireSignIn, isAdmin };