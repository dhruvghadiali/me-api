const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  addSchool,
  getSchools,
  updateSchool,
} = require("@MEControllers/schoolController/schoolController");
const {
  schoolPostReqBodyValidate,
} = require("@MEControllers/schoolController/schoolValidation");

const router = express.Router();

router
  .route("/schools")
  .get(superAdminProtect, getSchools)
  .post(superAdminProtect, schoolPostReqBodyValidate, addSchool);
router.route("/schools/:id").put(superAdminProtect, updateSchool);
// .patch(superAdminProtect)
// .delete(superAdminProtect);

module.exports = router;
