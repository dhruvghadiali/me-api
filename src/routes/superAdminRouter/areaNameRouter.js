const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addAreaName,
  getAreaNames,
  updateAreaName,
  deleteAreaName,
} = require("@MEControllers/areaNameController/areaNameController");
const {
  validateAreaNamesPutReqBody,
  validateAreaNamesPostReqBody,
  validateAreaNamesQueryParams,
} = require("@MEControllers/areaNameController/areaNameValidation");

const router = express.Router();

router
  .route("/area-names")
  .get(protect, getAreaNames)
  .post(protect, validateAreaNamesPostReqBody, addAreaName);
router
  .route("/area-names/:id")
  .put(
    protect,
    validateAreaNamesQueryParams,
    validateAreaNamesPutReqBody,
    updateAreaName
  )
  .delete(protect, validateAreaNamesQueryParams, deleteAreaName);

module.exports = router;
