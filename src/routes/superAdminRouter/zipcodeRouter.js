const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getZipcodes)
  .post(protect, validateZipcodesPostReqBody, addZipcode);
router
  .route("/zipcodes/:id")
  .put(
    protect,
    validateZipcodesQueryParams,
    validateZipcodesPutReqBody,
    updateZipcode
  )
  .delete(protect, validateZipcodesQueryParams, deleteZipcode);

module.exports = router;
