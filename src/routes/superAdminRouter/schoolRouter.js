const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getSchools)
  .post(protect, schoolPostReqBodyValidate, addSchool);
router.route("/schools/:id").put(protect, updateSchool);
// .patch(protect)
// .delete(protect);

module.exports = router;
