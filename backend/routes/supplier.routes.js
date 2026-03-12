const express = require("express");
const router = express.Router();

const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require("../controllers/supplier.controller");

router.route("/")
  .get(getSuppliers)
  .post(createSupplier);

router.route("/:id")
  .get(getSupplier)
  .put(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;