const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  updateOrganization,
} = require("@MEControllers/organizationController/organizationController");

const router = express.Router();

router.route("/organizations/:id").put(protect, updateOrganization);

module.exports = router;
