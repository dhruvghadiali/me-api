const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  updateOrganizationMember,
  deleteOrganizationMember,
} = require("@MEControllers/organizationMemberController/organizationMemberController");

const router = express.Router();

router
  .route("/organization-members/:id")
  .put(superAdminProtect, updateOrganizationMember)
  .delete(superAdminProtect, deleteOrganizationMember);

module.exports = router;
