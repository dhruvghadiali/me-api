const express = require("express");

const { superAdminProtect } = require("@MEMiddleware/auth");
const {
  addCity,
  getCities,
  updateCity,
  deleteCity,
} = require("@MEControllers/cityController/cityController");
const {
  validateCitiesPutReqBody,
  validateCitiesPostReqBody,
  validateCitiesQueryParams,
} = require("@MEControllers/cityController/cityValidation");

const router = express.Router();

router
  .route("/cities")
  .get(superAdminProtect, getCities)
  .post(superAdminProtect, validateCitiesPostReqBody, addCity);
router
  .route("/cities/:id")
  .put(
    superAdminProtect,
    validateCitiesQueryParams,
    validateCitiesPutReqBody,
    updateCity
  )
  .delete(superAdminProtect, validateCitiesQueryParams, deleteCity);

module.exports = router;
