const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateOrganizationMember,
} = require("@MEControllers/organizationMemberController");
const {
  validateUpdateOrganizationMemberPutReqBody,
} = require("@MEControllerValidators/organizationMemberValidator");

const router = express.Router();

router
  .route("/organization-members/:id")
  .put(
    schoolAdminProtect,
    validateUpdateOrganizationMemberPutReqBody,
    updateOrganizationMember
  );

module.exports = router;
