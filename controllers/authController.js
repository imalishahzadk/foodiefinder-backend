const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const pointsModel = require("../models/pointsModel");
const referralsModel = require("../models/referralsModel");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, answer, referrerId } = req.body;

    // Validation
    if (!name || !email || !password || !address || !phone || !answer) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already registered. Please login." });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      answer,
    });
    const savedUser = await newUser.save();

    // Create entry in points table for referred user if it doesn't exist
    let referredPoints = await pointsModel.findOne({ userId: savedUser._id });
    if (!referredPoints) {
      referredPoints = new pointsModel({ userId: savedUser._id });
      await referredPoints.save();
    }

    // Handle referral logic if referrerId exists
    if (referrerId) {
      const referrer = await userModel.findById(referrerId);
      if (referrer) {
        // Add referral relationship
        await referralsModel.create({ referrerId, referredId: savedUser._id });

        // Ensure the referrer has a points entry if it doesn't exist
        let referrerPoints = await pointsModel.findOne({ userId: referrerId });
        if (!referrerPoints) {
          referrerPoints = new pointsModel({ userId: referrerId });
          await referrerPoints.save();
        }

        // Points to give both referrer and referred
        const POINTS = 25;

        // Update points for both the referrer and referred
        await pointsModel.findOneAndUpdate(
          { userId: referrerId },
          { $inc: { points: POINTS } }
        );

        await pointsModel.findOneAndUpdate(
          { userId: savedUser._id },
          { $inc: { points: POINTS } }
        );
      }
    }

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Registration failed", error });
  }
};


//login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password...",
      });
    }

    // Check user
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send response with _id included
    res.status(200).send({
      success: true,
      message: "Login Successfully...",
      user: {
        _id: user._id, // Include the _id here
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// forgot password function
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ error: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ error: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ error: "New Password is required" });
    }
    // check

    const user = await userModel.findOne({ email, answer })
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer"
      })
    
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully"
    }) 
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// test controller
const testController = (req, res) => {
  res.send("test route");
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
};
