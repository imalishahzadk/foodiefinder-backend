const multer = require("multer");
const path = require("path");
const Review = require("../models/reviewModel");
const Sentiment = require("sentiment"); // Use a simple sentiment analysis library

// Set up multer storage for images and videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("Uploading file:", file); // Debugging log
      const fileTypes = ['image/jpeg', 'image/png', 'video/mp4'];
      if (fileTypes.includes(file.mimetype)) {
        cb(null, 'public/uploads/');
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });
  

const upload = multer({ storage }).fields([
  { name: 'reviewImage', maxCount: 5 }, // Allow multiple images
  { name: 'reviewVideo', maxCount: 1 }, // Allow only one video
]);

exports.addReview = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err.message);
      return res.status(400).json({ message: "Error uploading files", error: err.message });
    }

    try {
      const { name, stars, reviewText, restaurantId } = req.body;
      const userId = req.user._id; // Get the user ID from the authenticated request

      const reviewImageUrls = req.files["reviewImage"]?.map((file) => `/uploads/${file.filename}`) || [];
      const reviewVideoUrls = req.files["reviewVideo"]?.map((file) => `/uploads/${file.filename}`) || [];

      const newReview = new Review({
        userId, // Save the user ID
        name,
        stars,
        reviewText,
        restaurantId,
        reviewImageUrls,
        reviewVideoUrls,
      });

      const savedReview = await newReview.save();
      return res.status(201).json({ message: "Review added successfully", review: savedReview });
    } catch (error) {
      console.error("Error adding review:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};


// Controller function to get reviews for a specific restaurant
exports.getReviews = async (req, res) => {
  const { placeId } = req.params;
  
  try {
    const reviews = await Review.find({ restaurantId: placeId });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch all reviews
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Controller function to update a review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { name, stars, reviewText } = req.body;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // // Ensure the logged-in user owns the review
    // if (req.user._id.toString() !== review.userId.toString()) {
    //   return res.status(403).json({ message: "You are not authorized to update this review" });
    // }

            // Ensure the logged-in user owns the review or is an admin
            if (req.user._id.toString() !== review.userId.toString() && req.user.role !== 1) {
              console.log("Authorization failed for user:", req.user);

              return res.status(403).json({ message: "You are not authorized to update this review" });
              }

    // Update basic fields
    review.name = name || review.name;
    review.stars = stars || review.stars;
    review.reviewText = reviewText || review.reviewText;

    // Update image and video URLs if provided
    if (req.files?.reviewImage) {
      review.reviewImageUrls = req.files.reviewImage.map((file) => `/uploads/${file.filename}`);
    }
    if (req.files?.reviewVideo) {
      review.reviewVideoUrls = req.files.reviewVideo.map((file) => `/uploads/${file.filename}`);
    }

    // Save the updated review
    const updatedReview = await review.save();
    return res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller function to delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure the logged-in user owns the review
    // if (req.user._id.toString() !== review.userId.toString()) {
    //   return res.status(403).json({ message: "You are not authorized to delete this review" });
    // }
            // Ensure the logged-in user owns the review or is an admin
            if (req.user._id.toString() !== review.userId.toString() && req.user.role !== 1) {
              return res.status(403).json({ message: "You are not authorized to delete this review" });
          }
  

    await Review.findByIdAndDelete(id);
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Helper function for sentiment analysis
const analyzeSentiment = (reviews) => {
    const sentiment = new Sentiment();
    let positiveCount = 0;

    reviews.forEach((review) => {
        const result = sentiment.analyze(review.reviewText);
        if (result.score > 0) {
            positiveCount++;
        }
    });

    // Return true if the majority of reviews are positive
    return positiveCount / reviews.length > 0.5;
};

// Function to suggest restaurants
exports.suggestRestaurants = async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Fetch all restaurant reviews from the last month
        const reviews = await Review.find({
            createdAt: { $gte: oneMonthAgo },
        });

        // Group reviews by restaurantId
        const reviewsByRestaurant = reviews.reduce((acc, review) => {
            if (!acc[review.restaurantId]) {
                acc[review.restaurantId] = [];
            }
            acc[review.restaurantId].push(review);
            return acc;
        }, {});

        // Analyze reviews and collect suggested restaurants
        const suggestedRestaurants = [];

        for (const [restaurantId, restaurantReviews] of Object.entries(reviewsByRestaurant)) {
            if (restaurantReviews.length >= 10) {
                const isPositive = analyzeSentiment(restaurantReviews);
                if (isPositive) {
                    suggestedRestaurants.push(restaurantId);
                }
            }
        }

        // Return the suggested restaurants
        res.status(200).json({ suggestedRestaurants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch suggested restaurants." });
    }
};
