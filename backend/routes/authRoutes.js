const express = require("express");
const router  = express.Router();
const { sendOTP, verifyOTP, register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { body }    = require("express-validator");

router.post("/send-otp",   sendOTP);
router.post("/verify-otp", verifyOTP);

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("department").isIn(["CSE","ECE","MECH","CIVIL","EEE","IT"]).withMessage("Invalid department"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", protect, getMe);

module.exports = router;
