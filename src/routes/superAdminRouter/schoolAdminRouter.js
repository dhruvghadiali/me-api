const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  changePassword,
  updateSchoolAdminProfile,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthController");

const router = express.Router();

router
  .route("/school-admins/profile/:id")
  .put(protect, updateSchoolAdminProfile);
router.route("/school-admins/change-password/:id").put(protect, changePassword);

module.exports = router;
