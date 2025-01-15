const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const multer = require("multer");
const path = require("path"); // Add this line
const {requireSignIn , isAdmin } = require("../middlewares/authMiddleware");

// Set up multer storage (repeated from your code above)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileTypes = ["image/jpeg", "image/png", "video/mp4"];
    if (fileTypes.includes(file.mimetype)) {
      cb(null, "public/uploads/");
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage }).fields([
  { name: "reviewImage", maxCount: 5 },
  { name: "reviewVideo", maxCount: 1 },
]);

// Routes
router.post("/reviews", requireSignIn, reviewController.addReview);
router.get("/reviews/:placeId", reviewController.getReviews);
router.put("/admin-reviews/:id", requireSignIn, isAdmin, upload, reviewController.updateReview); // Add `upload` middleware here
router.delete("/admin-reviews/:id", requireSignIn, isAdmin, reviewController.deleteReview);
router.put("/reviews/:id", requireSignIn, upload, reviewController.updateReview); // Add `upload` middleware here
router.delete("/reviews/:id", requireSignIn, reviewController.deleteReview);

router.get("/reviews", reviewController.getAllReviews); // route for all reviews

router.get("/suggestions", reviewController.suggestRestaurants);

module.exports = router;
