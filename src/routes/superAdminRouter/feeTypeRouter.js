const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getFeeTypes)
  .post(protect, validateFeeTypesPostReqBody, addFeeType);
router
  .route("/fee-types/:id")
  .put(
    protect,
    validateFeeTypesQueryParams,
    validateFeeTypesPutReqBody,
    updateFeeType
  )
  .delete(protect, validateFeeTypesQueryParams, deleteFeeType);

module.exports = router;
