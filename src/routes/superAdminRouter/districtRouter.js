const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
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
  .get(superAdminProtect, getDistricts)
  .post(superAdminProtect, validateDistrictsPostReqBody, addDistrict);
router
  .route("/districts/:id")
  .put(
    superAdminProtect,
    validateDistrictsQueryParams,
    validateDistrictsPutReqBody,
    updateDistrict
  )
  .delete(superAdminProtect, validateDistrictsQueryParams, deleteDistrict);

module.exports = router;
