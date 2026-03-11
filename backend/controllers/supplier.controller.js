const Supplier = require("../models/Supplier");
const { validationResult } = require("express-validator");

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private (Admin/Manager)
const getSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true };

    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { companyName: { $regex: req.query.search, $options: "i" } },
        { displayName: { $regex: req.query.search, $options: "i" } },
        { supplierCode: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } }
      ];
    }

    // Filter by type
    if (req.query.type) {
      filter.supplierType = req.query.type;
    }

    // Filter by category
    if (req.query.category) {
      filter.supplierCategory = req.query.category;
    }

    // Filter by status
    if (req.query.status) {
      filter.supplierStatus = req.query.status;
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
      sortOption = { [sortField]: sortOrder };
    }

    const suppliers = await Supplier.find(filter)
      .populate("accountManager", "name email")
      .populate("createdBy", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await Supplier.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: suppliers,
      pagination: {
        currentPage: page,
        totalPages,
        totalSuppliers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get suppliers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching suppliers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate("accountManager", "name email")
      .populate("createdBy", "name email");

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    // Check if user has permission to view this supplier
    if (req.user.role !== "admin" && req.user.role !== "manager" &&
        supplier.accountManager?.toString() !== req.user.id &&
        supplier.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this supplier"
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error("Get supplier error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID"
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching supplier",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private (Admin/Manager)
const createSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const {
      supplierCode,
      supplierType,
      companyName,
      displayName,
      email,
      phone,
      fax,
      website,
      billingAddress,
      shippingAddress,
      contactPersons,
      taxId,
      businessRegistrationNumber,
      industry,
      paymentTerms,
      currency,
      creditLimit,
      supplierCategory,
      certifications,
      minimumOrderQuantity,
      leadTime,
      notes,
      tags
    } = req.body;

    // Check if supplier code already exists
    const existingSupplier = await Supplier.findOne({ supplierCode: supplierCode.toUpperCase() });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: "Supplier code already exists"
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await Supplier.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Supplier with this email already exists"
        });
      }
    }

    // Ensure at least one primary contact if contact persons are provided
    if (contactPersons && contactPersons.length > 0) {
      const hasPrimary = contactPersons.some(contact => contact.isPrimary);
      if (!hasPrimary) {
        contactPersons[0].isPrimary = true;
      }
    }

    const supplier = await Supplier.create({
      supplierCode: supplierCode.toUpperCase(),
      supplierType,
      companyName,
      displayName: displayName || companyName,
      email: email?.toLowerCase(),
      phone,
      fax,
      website,
      billingAddress,
      shippingAddress,
      contactPersons,
      taxId,
      businessRegistrationNumber,
      industry,
      paymentTerms,
      currency,
      creditLimit,
      supplierCategory,
      certifications,
      minimumOrderQuantity,
      leadTime,
      notes,
      tags,
      accountManager: req.body.accountManager,
      createdBy: req.user.id
    });

    await supplier.populate("accountManager", "name email");
    await supplier.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      data: supplier,
      message: "Supplier created successfully"
    });
  } catch (error) {
    console.error("Create supplier error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Supplier code or email already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating supplier",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private (Admin/Manager/Account Manager)
const updateSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user.role !== "manager" &&
        supplier.accountManager?.toString() !== req.user.id &&
        supplier.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this supplier"
      });
    }

    const {
      supplierCode,
      supplierType,
      companyName,
      displayName,
      email,
      phone,
      fax,
      website,
      billingAddress,
      shippingAddress,
      contactPersons,
      taxId,
      businessRegistrationNumber,
      industry,
      paymentTerms,
      currency,
      creditLimit,
      supplierCategory,
      certifications,
      minimumOrderQuantity,
      leadTime,
      supplierStatus,
      accountManager,
      notes,
      tags
    } = req.body;

    // Check if supplier code is being changed and if it already exists
    if (supplierCode && supplierCode.toUpperCase() !== supplier.supplierCode) {
      const existingSupplier = await Supplier.findOne({ supplierCode: supplierCode.toUpperCase() });
      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          message: "Supplier code already exists"
        });
      }
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== supplier.email) {
      const existingEmail = await Supplier.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Supplier with this email already exists"
        });
      }
    }

    // Ensure at least one primary contact if contact persons are provided
    if (contactPersons && contactPersons.length > 0) {
      const hasPrimary = contactPersons.some(contact => contact.isPrimary);
      if (!hasPrimary) {
        contactPersons[0].isPrimary = true;
      }
    }

    // Update supplier
    supplier.supplierCode = supplierCode?.toUpperCase() || supplier.supplierCode;
    supplier.supplierType = supplierType || supplier.supplierType;
    supplier.companyName = companyName || supplier.companyName;
    supplier.displayName = displayName || supplier.displayName;
    supplier.email = email?.toLowerCase() || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.fax = fax || supplier.fax;
    supplier.website = website || supplier.website;

    if (billingAddress) supplier.billingAddress = billingAddress;
    if (shippingAddress) supplier.shippingAddress = shippingAddress;
    if (contactPersons) supplier.contactPersons = contactPersons;

    supplier.taxId = taxId || supplier.taxId;
    supplier.businessRegistrationNumber = businessRegistrationNumber || supplier.businessRegistrationNumber;
    supplier.industry = industry || supplier.industry;
    supplier.paymentTerms = paymentTerms || supplier.paymentTerms;
    supplier.currency = currency || supplier.currency;
    supplier.creditLimit = creditLimit !== undefined ? creditLimit : supplier.creditLimit;
    supplier.supplierCategory = supplierCategory || supplier.supplierCategory;
    supplier.certifications = certifications || supplier.certifications;
    supplier.minimumOrderQuantity = minimumOrderQuantity !== undefined ? minimumOrderQuantity : supplier.minimumOrderQuantity;
    supplier.leadTime = leadTime !== undefined ? leadTime : supplier.leadTime;
    supplier.supplierStatus = supplierStatus || supplier.supplierStatus;
    supplier.accountManager = accountManager || supplier.accountManager;
    supplier.notes = notes || supplier.notes;
    supplier.tags = tags || supplier.tags;

    await supplier.save();

    await supplier.populate("accountManager", "name email");
    await supplier.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: supplier,
      message: "Supplier updated successfully"
    });
  } catch (error) {
    console.error("Update supplier error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => messages);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Supplier code or email already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating supplier",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Delete supplier (soft delete)
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin only)
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    // Only admin can delete suppliers
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete suppliers"
      });
    }

    // Soft delete by setting isActive to false
    supplier.isActive = false;
    await supplier.save();

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully"
    });
  } catch (error) {
    console.error("Delete supplier error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting supplier",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Get supplier performance metrics
// @route   GET /api/suppliers/:id/performance
// @access  Private
const getSupplierPerformance = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user.role !== "manager" &&
        supplier.accountManager?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view supplier performance"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        supplierCode: supplier.supplierCode,
        companyName: supplier.companyName,
        performanceMetrics: supplier.performanceMetrics,
        performanceScore: supplier.performanceScore,
        supplierCategory: supplier.supplierCategory
      }
    });
  } catch (error) {
    console.error("Get supplier performance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching supplier performance",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Update supplier performance metrics
// @route   PUT /api/suppliers/:id/performance
// @access  Private (Admin/Manager)
const updateSupplierPerformance = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update supplier performance"
      });
    }

    const { onTimeDelivery, qualityRating, averageLeadTime } = req.body;

    await supplier.updatePerformanceMetrics({
      onTimeDelivery,
      qualityRating,
      averageLeadTime
    });

    res.status(200).json({
      success: true,
      data: {
        supplierCode: supplier.supplierCode,
        companyName: supplier.companyName,
        performanceMetrics: supplier.performanceMetrics,
        performanceScore: supplier.performanceScore
      },
      message: "Supplier performance updated successfully"
    });
  } catch (error) {
    console.error("Update supplier performance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating supplier performance",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierPerformance,
  updateSupplierPerformance
};