const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  signIn,
  signUp,
  changePassword,
} = require("@MEControllers/superAdminAuthController/superAdminAuthController");

const {
  addState,
  getStates,
} = require("@MEControllers/stateController/stateController");
const {
  addDistrict,
  getDistricts,
} = require("@MEControllers/districtController/districtController");
const { addCity } = require("@MEControllers/cityController/cityController");
const {
  addZipcode,
} = require("@MEControllers/zipcodeController/zipcodeController");
const {
  addAreaName,
} = require("@MEControllers/areaNameController/areaNameController");

const router = express.Router();

router.route("/signin").post(signIn);
router.route("/signup").post(signUp);
router.route("/change-password").post(changePassword);
router.route("/states").post(protect, addState).get(protect, getStates);
router
  .route("/districts")
  .post(protect, addDistrict)
  .get(protect, getDistricts);
router.route("/districts/:id").get(protect, getDistricts);
router.route("/cities").post(protect, addCity);
router.route("/area-names").post(protect, addAreaName);
router.route("/zipcodes").post(protect, addZipcode);

module.exports = router;
