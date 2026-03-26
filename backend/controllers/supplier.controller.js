const Supplier = require("../models/Supplier");

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private 
exports.getSuppliers = async (req, res) => {
  try {

    const suppliers = await Supplier.find();

    res.status(200).json({
      success: true,
      data: suppliers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private 
exports.getSupplier = async (req, res) => {

  try {

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private 
exports.createSupplier = async (req, res) => {

  try {

    const { name, contact, address } = req.body;

    const supplier = await Supplier.create({
      name,
      contact,
      address
    });

    res.status(201).json({
      success: true,
      data: supplier
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private 
exports.updateSupplier = async (req, res) => {

  try {

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin)
exports.deleteSupplier = async (req, res) => {

  try {

    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};
