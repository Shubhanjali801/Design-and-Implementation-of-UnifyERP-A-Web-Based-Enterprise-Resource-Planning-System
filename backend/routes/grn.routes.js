const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const { getGRNs, getGRN, createGRN } = require("../controllers/grn.controller");

router.get("/", protect, authorizeRoles("admin", "inventory"), getGRNs);
router.post("/", protect, authorizeRoles("admin", "inventory"), createGRN);
router.get("/:id", protect, getGRN);

module.exports = router;
