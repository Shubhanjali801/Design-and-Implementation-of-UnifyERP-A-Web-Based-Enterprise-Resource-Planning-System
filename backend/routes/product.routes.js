const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductsByCategory
} = require("../controllers/product.controller");

const auth = require("../middleware/auth.middleware");

const router = express.Router();

// All product routes require authentication
router.use(auth);

// @desc    Get all products
// @route   GET /api/products
// @access  Private
// @query   ?category=electronics&isActive=true&search=wireless&page=1&limit=10&sort=-createdAt
router.get("/", getProducts);

// @desc    Get low stock products (reorder alerts)
// @route   GET /api/products/low-stock
// @access  Private
router.get("/low-stock", getLowStockProducts);

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Private
router.get("/category/:category", getProductsByCategory);

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
router.post("/", createProduct);

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Private
router.get("/:id", getProduct);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
router.put("/:id", updateProduct);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
router.delete("/:id", deleteProduct);

module.exports = router;