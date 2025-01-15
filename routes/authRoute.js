const express = require("express")
const {registerController} = require("../controllers/authController")
const { loginController } = require("../controllers/authController")
const { testController } = require("../controllers/authController");
const { forgotPasswordController } = require("../controllers/authController");
const { getReferralLinkController } = require("../controllers/getReferralLinkController");
const { getUserPointsController } = require("../controllers/getPointsController");
const {editProfileController} = require("../controllers/editProfileController")

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
//router object
const router = express.Router()

// routing
//Register || Post method
router.post("/register", registerController)
// Login || Post method
router.post("/login", loginController)

//forgot password || post method
router.post("/forgot-password", forgotPasswordController)

// test route
router.get("/test", requireSignIn, isAdmin, testController)

// protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ok: true})
})
// protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true})
})


router.get("/referral-link", requireSignIn, getReferralLinkController);
router.get("/points", requireSignIn, getUserPointsController);

router.put("/edit-profile", requireSignIn, editProfileController);


module.exports = router