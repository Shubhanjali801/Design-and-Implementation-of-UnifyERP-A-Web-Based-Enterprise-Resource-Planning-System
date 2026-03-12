const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const { getPurchaseOrders, getPurchaseOrder, createPurchaseOrder, updatePurchaseOrder, cancelPurchaseOrder } = require("../controllers/purchase.order.controller");

router.route("/").get(protect, getPurchaseOrders).post(protect, authorizeRoles("admin", "purchase"), createPurchaseOrder);
router.route("/:id").get(protect, getPurchaseOrder).put(protect, authorizeRoles("admin", "purchase"), updatePurchaseOrder).delete(protect, authorizeRoles("admin"), cancelPurchaseOrder);

module.exports = router;
