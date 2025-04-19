const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET user's cart
router.get("/", authMiddleware.protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    const products = cart.items.map((item) => ({
      _id: item.productId._id,
      title: item.productId.title,
      description: item.productId.description,
      price: item.productId.price,
      images: item.productId.images,
      quantity: item.quantity,
    }));

    res.status(200).json({ products });
  } catch (err) {
    console.error("Failed to get cart:", err);
    res.status(500).json({ error: "Failed to get cart" });
  }
});

// ✅ ADD product to cart
router.post("/add", authMiddleware.protect, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity are required" });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // If item exists, update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If item doesn't exist, push new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Failed to add product to cart:", err);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

// ✅ REMOVE product from cart
router.post("/remove", authMiddleware.protect, async (req, res) => {
  const { productId } = req.body; // Only expect productId here

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("Failed to remove product from cart:", err);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});


// ✅ CLEAR cart
router.delete("/clear", authMiddleware.protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Failed to clear cart:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
