const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  updateOrganizationMember,
  deleteOrganizationMember,
} = require("@MEControllers/organizationMemberController/organizationMemberController");

const router = express.Router();

router
  .route("/organization-members/:id")
  .put(protect, updateOrganizationMember)
  .delete(protect, deleteOrganizationMember);

module.exports = router;
