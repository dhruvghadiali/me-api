const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolFacility,
  getSchoolFacilities,
  deleteSchoolFacility,
} = require("@MEControllers/schoolFacilityController/schoolFacilityController");
const {
  validateSchoolFacilityPostReqBody,
  validateSchoolFacilityQueryParamsForSchool,
  validateSchoolFacilityQueryParamsForSchoolFacilityId,
} = require("@MEControllers/schoolFacilityController/schoolFacilityValidation");

const router = express.Router();

router
  .route("/school-facilities/")
  .post(
    schoolAdminProtect,
    validateSchoolFacilityPostReqBody,
    addSchoolFacility
  );

router
  .route("/school-facilities/:id")
  .delete(
    schoolAdminProtect,
    validateSchoolFacilityQueryParamsForSchoolFacilityId,
    deleteSchoolFacility
  );

router
  .route("/school-facilities/:school")
  .get(
    schoolAdminProtect,
    validateSchoolFacilityQueryParamsForSchool,
    getSchoolFacilities
  );

module.exports = router;
