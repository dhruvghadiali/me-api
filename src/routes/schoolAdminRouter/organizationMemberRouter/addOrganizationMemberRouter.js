const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addOrganizationMember,
} = require("@MEControllers/organizationMemberController/addOrganizationMemberController");
const {
  validateAddOrganizationMembersPostReqBody,
} = require("@MEControllerValidators/organizationMemberValidator");

const router = express.Router();

router
  .route("/organization-members/:organizationId")
  .post(
    schoolAdminProtect,
    validateAddOrganizationMembersPostReqBody,
    addOrganizationMember
  );

module.exports = router;
