const Razorpay = require("razorpay");
const Order = require("../models/orderModel");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_LwvSguokiSeEX6",   
  key_secret: "6twFiFLEi5zBiPLNn36qoqdH",
});


const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentStatus: "Pending",
    });

    const savedOrder = await order.save();

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ message: "Payment creation failed" });
    }

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
      razorpayOrder,
      key_id: razorpayInstance.key_id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = status || "Paid";
    order.paymentId = paymentId;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  updatePaymentStatus,
};


// const Order = require("../models/orderModel");

// const createOrder = async (req, res) => {
//   try {
//     const { items, shippingAddress, totalAmount } = req.body;

//     console.log("Body received:", req.body); // Debug log

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No order items provided" });
//     }

//     const order = new Order({
//       user: req.user._id, // Comes from auth middleware
//       items,
//       shippingAddress,
//       totalAmount,
//       paymentStatus: "Pending",
//     });

//     const savedOrder = await order.save();

//     res.status(201).json({
//       message: "Order created successfully",
//       order: savedOrder,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { createOrder };
