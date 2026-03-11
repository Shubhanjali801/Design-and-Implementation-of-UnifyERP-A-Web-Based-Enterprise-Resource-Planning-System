const express        = require("express");
const router         = express.Router();
const protect        = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier, getSupplierPerformance, updateSupplierPerformance } = require("../controllers/supplier.controller");

router.route("/").get(protect, getSuppliers).post(protect, authorizeRoles("admin","purchase"), createSupplier);
router.get("/:id/performance", protect, getSupplierPerformance);
router.put("/:id/performance", protect, authorizeRoles("admin","purchase"), updateSupplierPerformance);
router.route("/:id").get(protect, getSupplier).put(protect, authorizeRoles("admin","purchase"), updateSupplier).delete(protect, authorizeRoles("admin"), deleteSupplier);

module.exports = router;
