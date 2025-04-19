const Product = require("../models/Products");

// Add a new product
const addProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      seller: req.user.id, // seller ID from authenticated token
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err.message);
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email"); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Get products added by the logged-in seller
// Get products added by the logged-in seller
const getSellerProducts = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Not a seller." });
    }

    const sellerProducts = await Product.find({ seller: req.user.id });

    // Send array directly
    res.json(sellerProducts);
  } catch (error) {
    console.error("Error fetching seller products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};


// const Product = require("../models/Products");

// // Add a new product
// const addProduct = async (req, res) => {
//   const { name, description, price, category, stock, images } = req.body;

//   try {
//     const product = new Product({
//       name,
//       description,
//       price,
//       category,
//       stock,
//       images,
//       seller: req.user.id, 
//     });

//     await product.save();
//     res.status(201).json(product);
//   } catch (err) {
//     console.error("Error adding product:", err.message);
//     res.status(500).json({ message: "Failed to add product", error: err.message });
//   }
// };

// // Get all products
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching products", error });
//   }
// };

// // Get a single product by ID
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching product", error });
//   }
// };

// // Update product
// const updateProduct = async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating product", error });
//   }
// };

// // Delete product
// const deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting product", error });
//   }
// };

// // Get products added by the logged-in seller
// const getSellerProducts = async (req, res) => {
//   try {
//     if (req.user.role !== "seller") {
//       return res.status(403).json({ message: "Access denied. Not a seller." });
//     }

//     const sellerProducts = await Product.find({ seller: req.user.id });
//     res.json(sellerProducts);
//   } catch (error) {
//     console.error("Error fetching seller products:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   addProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   getSellerProducts,
// };
