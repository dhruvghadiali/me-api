const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addSchool,
  getSchools,
  updateSchool,
} = require("@MEControllers/schoolController/schoolController");

const router = express.Router();

router.route("/schools").get(protect, getSchools).post(protect, addSchool);
router.route("/schools/:id").put(protect, updateSchool);
// .patch(protect)
// .delete(protect);

module.exports = router;
