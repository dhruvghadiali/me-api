const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  addZipcode,
  getZipcodes,
  updateZipcode,
  deleteZipcode,
} = require("@MEControllers/zipcodeController/zipcodeController");

const router = express.Router();

router.route("/zipcodes").get(protect, getZipcodes).post(protect, addZipcode);
router
  .route("/zipcodes/:id")
  .put(protect, updateZipcode)
  .delete(protect, deleteZipcode);

module.exports = router;
