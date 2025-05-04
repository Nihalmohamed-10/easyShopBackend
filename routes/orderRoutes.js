// const express = require("express");
// const router = express.Router();
// const { createOrder } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");

// router.post("/create-order", protect, createOrder);

// module.exports = router;



const express = require("express");
const router = express.Router();
const { createOrder, updatePaymentStatus } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/update-payment-status", protect, updatePaymentStatus);

module.exports = router;
