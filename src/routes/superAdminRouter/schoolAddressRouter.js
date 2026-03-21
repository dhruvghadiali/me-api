const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  changeSchoolAddressStatus,
} = require("@MEControllers/schoolAddressController/schoolAddressController");
const {
  updateSchoolAddress,
} = require("@MEControllers/schoolAddressController");

const router = express.Router();

router
  .route("/school-addresses/:id")
  .put(superAdminProtect, updateSchoolAddress)
  .delete(superAdminProtect, changeSchoolAddressStatus)
  .patch(superAdminProtect, changeSchoolAddressStatus);

module.exports = router;
