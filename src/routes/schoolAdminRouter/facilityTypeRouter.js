const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  getFacilityTypes,
} = require("@MEControllers/facilityTypeController/facilityTypeController");

const router = express.Router();

router.route("/facility-types").get(schoolAdminProtect, getFacilityTypes);

module.exports = router;
