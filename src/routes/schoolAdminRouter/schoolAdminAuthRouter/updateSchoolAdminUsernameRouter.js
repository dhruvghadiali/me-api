const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateSchoolAdminUsername
} = require("@MEControllers/schoolAdminAuthController");
const {
  validateUpdateSchoolAdminUsernamePutReqBody,
} = require("@MEControllerValidators/schoolAdminAuthValidator");

const router = express.Router();

router
  .route("/update-username")
  .put(
    schoolAdminProtect,
    validateUpdateSchoolAdminUsernamePutReqBody,
    updateSchoolAdminUsername,
  );

module.exports = router;
