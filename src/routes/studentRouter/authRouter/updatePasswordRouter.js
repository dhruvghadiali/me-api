const express = require("express");

const { studentProtect } = require("@MEMiddleware/auth");
const { updatePassword } = require("@MEControllers/studentAuthController");
const {
  validateStudentUpdatePasswordPutReqBody,
} = require("@MEControllerValidators/studentAuthValidator");

const router = express.Router();

router
  .route("/update-password")
  .put(studentProtect, validateStudentUpdatePasswordPutReqBody, updatePassword);

module.exports = router;
