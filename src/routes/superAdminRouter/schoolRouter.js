const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addSchool,
} = require("@MEControllers/schoolController/schoolController");
const {
  validateSchoolReqBody,
} = require("@MEControllers/schoolController/schoolValidation");

const router = express.Router();

router.route("/schools").post(protect, validateSchoolReqBody, addSchool);

module.exports = router;
