const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolFee,
  getSchoolFees,
  updateSchoolFee,
  deleteSchoolFee,
} = require("@MEControllers/schoolFeeController/schoolFeeController");
const {
  validateSchoolFeesPutReqBody,
  validateSchoolFeesPostReqBody,
  validateSchoolFeeQueryParams,
  validateSchoolFeesAcademicClassQueryParams,
} = require("@MEControllers/schoolFeeController/schoolFeeValidation");

const router = express.Router();

router
  .route("/school-fees")
  .post(schoolAdminProtect, validateSchoolFeesPostReqBody, addSchoolFee);
router
  .route("/school-fees/:school_academic_class")
  .get(
    schoolAdminProtect,
    validateSchoolFeesAcademicClassQueryParams,
    getSchoolFees
  );

router
  .route("/school-fees/:id")
  .put(
    schoolAdminProtect,
    validateSchoolFeeQueryParams,
    validateSchoolFeesPutReqBody,
    updateSchoolFee
  )
  .delete(schoolAdminProtect, validateSchoolFeeQueryParams, deleteSchoolFee);

module.exports = router;
