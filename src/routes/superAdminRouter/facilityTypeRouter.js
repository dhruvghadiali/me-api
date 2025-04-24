const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addFacilityType,
  getFacilityTypes,
  deleteFacilityType,
  updateFacilityType,
} = require("@MEControllers/facilityTypeController/facilityTypeController");
const {
  validateFacilityTypesPutReqBody,
  validateFacilityTypesPostReqBody,
  validateFacilityTypesQueryParams,
} = require("@MEControllers/facilityTypeController/facilityTypeValidation");

const router = express.Router();

router
  .route("/facility-types")
  .get(protect, getFacilityTypes)
  .post(protect, validateFacilityTypesPostReqBody, addFacilityType);
router
  .route("/facility-types/:id")
  .put(
    protect,
    validateFacilityTypesQueryParams,
    validateFacilityTypesPutReqBody,
    updateFacilityType
  )
  .delete(protect, validateFacilityTypesQueryParams, deleteFacilityType);

module.exports = router;
