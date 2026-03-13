const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateSchoolAboutInformation,
} = require("@MEControllers/schoolController");
const {
  validateUpdateSchoolAboutReqBody,
} = require("@MEControllerValidators/schoolValidator");

const router = express.Router();

router
  .route("/school-about/:id")
  .put(
    schoolAdminProtect,
    validateUpdateSchoolAboutReqBody,
    updateSchoolAboutInformation,
  );

module.exports = router;
