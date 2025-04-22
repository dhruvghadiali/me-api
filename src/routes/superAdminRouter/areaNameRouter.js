const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addAreaName,
  getAreaNames,
  updateAreaName,
  deleteAreaName,
} = require("@MEControllers/areaNameController/areaNameController");

const router = express.Router();

router
  .route("/area-names")
  .get(protect, getAreaNames)
  .post(protect, addAreaName);
router
  .route("/area-names/:id")
  .put(protect, updateAreaName)
  .delete(protect, deleteAreaName);

module.exports = router;
