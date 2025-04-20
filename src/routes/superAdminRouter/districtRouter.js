const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addDistrict,
  getDistricts,
  updateDistrict,
  deleteDistrict,
} = require("@MEControllers/districtController/districtController");

const router = express.Router();

router
  .route("/districts")
  .get(protect, getDistricts)
  .post(protect, addDistrict);
router
  .route("/districts/:id")
  .put(protect, updateDistrict)
  .delete(protect, deleteDistrict);

module.exports = router;
