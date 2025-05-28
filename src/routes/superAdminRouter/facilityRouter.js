const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  addFacility,
  getFacilities,
  deleteFacility,
  updateFacility,
} = require("@MEControllers/facilityController/facilityController");
const {
  validateFacilitiesPutReqBody,
  validateFacilitiesPostReqBody,
  validateFacilitiesQueryParams,
} = require("@MEControllers/facilityController/facilityValidation");

const router = express.Router();

router
  .route("/facilities")
  .get(superAdminProtect, getFacilities)
  .post(superAdminProtect, validateFacilitiesPostReqBody, addFacility);
router
  .route("/facilities/:id")
  .put(
    superAdminProtect,
    validateFacilitiesQueryParams,
    validateFacilitiesPutReqBody,
    updateFacility
  )
  .delete(superAdminProtect, validateFacilitiesQueryParams, deleteFacility);

module.exports = router;
