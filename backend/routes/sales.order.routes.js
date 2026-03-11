const express        = require("express");
const router         = express.Router();
const protect        = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const { getSalesOrders, getSalesOrder, createSalesOrder, updateSalesOrder, cancelSalesOrder } = require("../controllers/sales.order.controller");

router.route("/").get(protect, getSalesOrders).post(protect, authorizeRoles("admin","sales"), createSalesOrder);
router.route("/:id").get(protect, getSalesOrder).put(protect, authorizeRoles("admin","sales"), updateSalesOrder).delete(protect, authorizeRoles("admin"), cancelSalesOrder);

module.exports = router;
