const express = require("express");
const { sendOTP, verifyOTP } = require("../controller/authController");

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verification", verifyOTP);

module.exports = router;
