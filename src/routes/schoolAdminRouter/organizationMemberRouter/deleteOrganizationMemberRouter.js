const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  deleteOrganizationMember
} = require("@MEControllers/organizationMemberController");

const router = express.Router();

router
  .route("/organization-members/:id")
  .delete(schoolAdminProtect, deleteOrganizationMember);

module.exports = router;
