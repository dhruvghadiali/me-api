const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const { updateUsername } = require("@MEControllers/studentAuthController");
const {
  validateStudentUpdateUsernamePutReqBody,
} = require("@MEControllerValidators/studentAuthValidator");

const router = express.Router();

router
  .route("/update-username")
  .put(studentProtect, validateStudentUpdateUsernamePutReqBody, updateUsername);

module.exports = router;
