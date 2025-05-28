const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
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
  .get(superAdminProtect, getAreaNames)
  .post(superAdminProtect, validateAreaNamesPostReqBody, addAreaName);
router
  .route("/area-names/:id")
  .put(
    superAdminProtect,
    validateAreaNamesQueryParams,
    validateAreaNamesPutReqBody,
    updateAreaName
  )
  .delete(superAdminProtect, validateAreaNamesQueryParams, deleteAreaName);

module.exports = router;
