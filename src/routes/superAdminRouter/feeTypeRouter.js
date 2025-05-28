const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  addFeeType,
  getFeeTypes,
  updateFeeType,
  deleteFeeType,
} = require("@MEControllers/feeTypeController/feeTypeController");
const {
  validateFeeTypesPutReqBody,
  validateFeeTypesPostReqBody,
  validateFeeTypesQueryParams,
} = require("@MEControllers/feeTypeController/feeTypeValidation");

const router = express.Router();

router
  .route("/fee-types")
  .get(superAdminProtect, getFeeTypes)
  .post(superAdminProtect, validateFeeTypesPostReqBody, addFeeType);
router
  .route("/fee-types/:id")
  .put(
    superAdminProtect,
    validateFeeTypesQueryParams,
    validateFeeTypesPutReqBody,
    updateFeeType
  )
  .delete(superAdminProtect, validateFeeTypesQueryParams, deleteFeeType);

module.exports = router;
