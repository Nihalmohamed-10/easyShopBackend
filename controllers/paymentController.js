const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};

// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // @desc    Create Razorpay Order
// // @route   POST /api/razorpay/order
// // @access  Private
// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: amount * 100, // amount in smallest currency unit (paise)
//       currency: "INR",
//       receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (error) {
//     console.error("Razorpay order creation error:", error);
//     res.status(500).json({ message: "Failed to create Razorpay order" });
//   }
// };

// // @desc    Verify Razorpay Payment
// // @route   POST /api/razorpay/verify
// // @access  Public (or Private if needed)
// const verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const sign = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(sign.toString())
//     .digest("hex");

//   if (expectedSignature === razorpay_signature) {
//     return res.status(200).json({ success: true, message: "Payment verified" });
//   } else {
//     return res.status(400).json({ success: false, message: "Payment verification failed" });
//   }
// };

// module.exports = {
//   createRazorpayOrder,
//   verifyPayment,
// };
