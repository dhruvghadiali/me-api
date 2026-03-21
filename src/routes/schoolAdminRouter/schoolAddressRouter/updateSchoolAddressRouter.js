const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  updateSchoolAddress,
} = require("@MEControllers/schoolAddressController");
const {
  validateSchoolAddressMetaInformationPutReqBody,
} = require("@MEControllerValidators/schoolAddressValidator");

const router = express.Router();

router
  .route("/school-addresses/:id")
  .put(
    schoolAdminProtect,
    validateSchoolAddressMetaInformationPutReqBody,
    updateSchoolAddress,
  );

module.exports = router;
