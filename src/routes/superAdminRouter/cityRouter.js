const express = require("express");

const { protect } = require("@MEMiddleware/auth");
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
  .get(protect, getCities)
  .post(protect, validateCitiesPostReqBody, addCity);
router
  .route("/cities/:id")
  .put(protect, validateCitiesQueryParams, validateCitiesPutReqBody, updateCity)
  .delete(protect, validateCitiesQueryParams, deleteCity);

module.exports = router;
