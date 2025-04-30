const express = require("express");

const { protect } = require("@MEMiddleware/auth");
const {
  updateSchoolAddress,
  changeSchoolAddressStatus,
} = require("@MEControllers/schoolAddressController/schoolAddressController");

const router = express.Router();

router
  .route("/school-addresses/:id")
  .put(protect, updateSchoolAddress)
  .delete(protect, changeSchoolAddressStatus)
  .patch(protect, changeSchoolAddressStatus);

module.exports = router;
