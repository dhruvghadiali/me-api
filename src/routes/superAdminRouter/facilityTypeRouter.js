const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
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
  .get(superAdminProtect, getFacilityTypes)
  .post(superAdminProtect, validateFacilityTypesPostReqBody, addFacilityType);
router
  .route("/facility-types/:id")
  .put(
    superAdminProtect,
    validateFacilityTypesQueryParams,
    validateFacilityTypesPutReqBody,
    updateFacilityType
  )
  .delete(
    superAdminProtect,
    validateFacilityTypesQueryParams,
    deleteFacilityType
  );

module.exports = router;
