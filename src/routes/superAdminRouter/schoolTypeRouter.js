const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addSchoolType,
  getSchoolTypes,
  updateSchoolType,
  deleteSchoolType,
} = require("@MEControllers/schoolTypeController/schoolTypeController");

const router = express.Router();

router
  .route("/school-types")
  .get(protect, getSchoolTypes)
  .post(protect, addSchoolType);
router
  .route("/school-types/:id")
  .put(protect, updateSchoolType)
  .delete(protect, deleteSchoolType);

module.exports = router;
