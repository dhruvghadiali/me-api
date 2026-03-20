const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  updateOrganizationMember,
} = require("@MEControllers/organizationMemberController");
const { deleteOrganizationMember } = require("@MEControllers/organizationMemberController");

const router = express.Router();

router
  .route("/organization-members/:id")
  .put(superAdminProtect, updateOrganizationMember)
  .delete(superAdminProtect, deleteOrganizationMember);

module.exports = router;
