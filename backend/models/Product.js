const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // Basic Product Information
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },

  // Prevents duplicate product codes
  SKU: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, "SKU cannot exceed 50 characters"]
  },

  // Pricing Information
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },

  // Inventory Information
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },

  // Alert when stock is low information
  reorderLevel: {
    type: Number,
    required: [true, "Reorder level is required"],
    min: [0, "Reorder level cannot be negative"],
    default: 0
  },

  // Additional Product Details (Optional but recommended for ERP)
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },

  // Product grouping information
  category: {
    type: String,
    trim: true,
    maxlength: [50, "Category cannot exceed 50 characters"]
  },

  // pieces / kg / box information
  unit: {
    type: String,
    enum: ["pieces", "kg", "lbs", "liters", "meters", "boxes", "packs"],
    default: "pieces"
  },

  // Status and Metadata
  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function() {
  if (this.stock <= 0) return "Out of Stock";
  if (this.stock <= this.reorderLevel) return "Low Stock";
  return "In Stock";
});

// Index for better query performance
productSchema.index({ SKU: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure SKU is uppercase
productSchema.pre("save", function(next) {
  if (this.SKU) {
    this.SKU = this.SKU.toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);