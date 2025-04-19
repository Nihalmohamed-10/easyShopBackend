const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: Number,
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

