const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/", protect, addProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.get("/seller/products", protect, getSellerProducts);

module.exports = router;



// const express = require("express");
// const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
// const { protect } = require("../middleware/authMiddleware"); 
// const verifyRole = require("../middleware/verifyRole"); 
// const router = express.Router();

// router.post("/", protect, verifyRole(["seller"]), addProduct);
// // router.post("/", addProduct); // Add product
// router.get("/", getProducts); // Get all products
// router.get("/:id", getProductById); // Get a product by ID
// router.put("/:id", protect, verifyRole(["seller"]), updateProduct);
// router.delete("/:id", protect, verifyRole(["seller"]), deleteProduct);
// // routes/productRoutes.js
// router.get("/seller", protect, sellerOnly, async (req, res) => {
//     const sellerProducts = await Product.find({ seller: req.user.id });
//     res.json(sellerProducts);
//   });
  

// module.exports = router;
