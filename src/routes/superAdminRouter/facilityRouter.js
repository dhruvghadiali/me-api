const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getFacilities)
  .post(protect, validateFacilitiesPostReqBody, addFacility);
router
  .route("/facilities/:id")
  .put(
    protect,
    validateFacilitiesQueryParams,
    validateFacilitiesPutReqBody,
    updateFacility
  )
  .delete(protect, validateFacilitiesQueryParams, deleteFacility);

module.exports = router;
