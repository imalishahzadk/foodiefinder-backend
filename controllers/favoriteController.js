const userModel = require("../models/userModel");

// Add a restaurant to favorites
exports.addFavorite = async (req, res) => {
    try {
        const { placeId } = req.body;
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.favorites.includes(placeId)) {
            user.favorites.push(placeId);
            await user.save();
        }

        res.status(200).json({ success: true, message: "Restaurant added to favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Remove a restaurant from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const { placeId } = req.body;
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.favorites = user.favorites.filter((id) => id !== placeId);
        await user.save();

        res.status(200).json({ success: true, message: "Restaurant removed from favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// Get all favorite restaurants
exports.getFavorites = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
