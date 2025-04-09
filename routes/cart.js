const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import auth middleware here

// Get cart by userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
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

// Add to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Failed to add product to cart:", err);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

// Remove item from cart
router.post("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("Failed to remove product:", err.message);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});

// ✅ Clear the cart (auth required)
router.delete("/clear", authMiddleware.protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    console.error("Error clearing cart:", err.message);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
