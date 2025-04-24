const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addDistrict,
  getDistricts,
  updateDistrict,
  deleteDistrict,
} = require("@MEControllers/districtController/districtController");
const {
  validateDistrictsPutReqBody,
  validateDistrictsPostReqBody,
  validateDistrictsQueryParams,
} = require("@MEControllers/districtController/districtValidation");

const router = express.Router();

router
  .route("/districts")
  .get(protect, getDistricts)
  .post(protect, validateDistrictsPostReqBody, addDistrict);
router
  .route("/districts/:id")
  .put(
    protect,
    validateDistrictsQueryParams,
    validateDistrictsPutReqBody,
    updateDistrict
  )
  .delete(protect, validateDistrictsQueryParams, deleteDistrict);

module.exports = router;
