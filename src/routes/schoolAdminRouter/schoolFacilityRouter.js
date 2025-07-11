const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getSchoolFacilities,
} = require("@MEControllers/schoolFacilityController/schoolFacilityController");
const {
  validateSchoolFacilityQueryParamsForSchool,
} = require("@MEControllers/schoolFacilityController/schoolFacilityValidation");

const router = express.Router();

router
  .route("/school-facilities/:school")
  .get(
    schoolAdminProtect,
    validateSchoolFacilityQueryParamsForSchool,
    getSchoolFacilities
  );

module.exports = router;
