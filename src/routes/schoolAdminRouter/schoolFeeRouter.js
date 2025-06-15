const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolFee,
  getSchoolFees,
} = require("@MEControllers/schoolFeeController/schoolFeeController");

const router = express.Router();

router.route("/school-fees").post(schoolAdminProtect, addSchoolFee);
router
  .route("/school-fees/:academic_class")
  .get(schoolAdminProtect, getSchoolFees);
