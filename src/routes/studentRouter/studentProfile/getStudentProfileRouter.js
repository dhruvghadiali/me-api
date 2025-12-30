const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const {
  getStudentProfileInfo,
} = require("@MEControllers/studentProfileController");

const router = express.Router();

router.route("/profile").get(studentProtect, getStudentProfileInfo);

module.exports = router;
