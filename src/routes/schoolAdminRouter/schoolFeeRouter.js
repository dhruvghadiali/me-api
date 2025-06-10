const express = require("express");

const { schoolAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchoolFee,
} = require("@MEControllers/schoolFeeController/schoolFeeController");

const router = express.Router();

router.route("/school-fees").post(schoolAdminProtect, addSchoolFee);
