const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  addZipcode,
  getZipcodes,
  updateZipcode,
  deleteZipcode,
} = require("@MEControllers/zipcodeController/zipcodeController");
const {
  validateZipcodesPutReqBody,
  validateZipcodesPostReqBody,
  validateZipcodesQueryParams,
} = require("@MEControllers/zipcodeController/zipcodeValidation");

const router = express.Router();

router
  .route("/zipcodes")
  .get(superAdminProtect, getZipcodes)
  .post(superAdminProtect, validateZipcodesPostReqBody, addZipcode);
router
  .route("/zipcodes/:id")
  .put(
    superAdminProtect,
    validateZipcodesQueryParams,
    validateZipcodesPutReqBody,
    updateZipcode
  )
  .delete(superAdminProtect, validateZipcodesQueryParams, deleteZipcode);

module.exports = router;
