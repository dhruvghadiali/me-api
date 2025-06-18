const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolFee,
  getSchoolFees,
  updateSchoolFee,
} = require("@MEControllers/schoolFeeController/schoolFeeController");

const router = express.Router();

router.route("/school-fees").post(schoolAdminProtect, addSchoolFee);
router
  .route("/school-fees/:school_academic_class")
  .get(schoolAdminProtect, getSchoolFees);

router.route("/school-fees/:id").put(schoolAdminProtect, updateSchoolFee);

module.exports = router;
