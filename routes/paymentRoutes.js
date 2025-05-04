const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-razorpay-order", protect, createRazorpayOrder);

module.exports = router;
