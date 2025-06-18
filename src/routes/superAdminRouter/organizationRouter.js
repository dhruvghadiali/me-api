const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  updateOrganization,
} = require("@MEControllers/organizationController/organizationController");

const router = express.Router();

router.route("/organizations/:id").put(superAdminProtect, updateOrganization);

module.exports = router;
