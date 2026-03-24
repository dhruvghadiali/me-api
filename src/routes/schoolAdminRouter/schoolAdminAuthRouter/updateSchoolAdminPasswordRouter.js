const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateSchoolAdminPassword,
} = require("@MEControllers/schoolAdminAuthController");
const {
  validateUpdateSchoolAdminPasswordPutReqBody,
} = require("@MEControllerValidators/schoolAdminAuthValidator");

const router = express.Router();

router
  .route("/update-password")
  .put(
    schoolAdminProtect,
    validateUpdateSchoolAdminPasswordPutReqBody,
    updateSchoolAdminPassword,
  );

module.exports = router;
