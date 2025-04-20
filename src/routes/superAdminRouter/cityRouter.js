const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addCity,
  getCities,
  updateCity,
  deleteCity,
} = require("@MEControllers/cityController/cityController");

const router = express.Router();

router.route("/cities").get(protect, getCities).post(protect, addCity);
router
  .route("/cities/:id")
  .put(protect, updateCity)
  .delete(protect, deleteCity);

module.exports = router;
