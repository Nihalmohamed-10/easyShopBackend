const express = require("express");
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware"); 
const verifyRole = require("../middleware/verifyRole"); 
const router = express.Router();

router.post("/", protect, verifyRole(["seller"]), addProduct);
// router.post("/", addProduct); // Add product
router.get("/", getProducts); // Get all products
router.get("/:id", getProductById); // Get a product by ID
router.put("/:id", protect, verifyRole(["seller"]), updateProduct);
router.delete("/:id", protect, verifyRole(["seller"]), deleteProduct);

module.exports = router;
