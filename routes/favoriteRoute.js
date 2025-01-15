const express = require("express");
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoriteController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/favorites/add", requireSignIn, addFavorite);
router.post("/favorites/remove", requireSignIn, removeFavorite);
router.get("/favorites", requireSignIn, getFavorites);

module.exports = router;
