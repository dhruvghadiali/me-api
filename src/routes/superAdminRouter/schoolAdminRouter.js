const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  changePassword,
  updateSchoolAdminProfile,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthController");

const router = express.Router();

router
  .route("/school-admins/profile/:id")
  .put(superAdminProtect, updateSchoolAdminProfile);
router
  .route("/school-admins/change-password/:id")
  .put(superAdminProtect, changePassword);

module.exports = router;
