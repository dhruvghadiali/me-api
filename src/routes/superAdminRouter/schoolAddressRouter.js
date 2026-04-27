const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  changeSchoolAddressStatus,
} = require("@MEControllers/schoolAddressController/schoolAddressController");
const {
  addSchoolAddress,
  updateSchoolAddress,
} = require("@MEControllers/schoolAddressController");
const {
  validateSchoolAddressPostReqBody,
} = require("@MEControllerValidators/schoolAddressValidator");

const router = express.Router();

router
  .route("/school-addresses/:id")
  .put(superAdminProtect, updateSchoolAddress)
  .delete(superAdminProtect, changeSchoolAddressStatus)
  .patch(superAdminProtect, changeSchoolAddressStatus);

router
  .route("/school-addresses")
  .post(superAdminProtect, validateSchoolAddressPostReqBody, addSchoolAddress);

module.exports = router;
