const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addOrganizationMember,
} = require("@MEControllers/organizationMemberController");
const {
  validateAddOrganizationMemberPostReqBody,
} = require("@MEControllerValidators/organizationMemberValidator");

const router = express.Router();

router
  .route("/organization-members/:id")
  .post(
    schoolAdminProtect,
    validateAddOrganizationMemberPostReqBody,
    addOrganizationMember
  );

module.exports = router;
