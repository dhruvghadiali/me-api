const moment = require("moment");
const mongoose = require("mongoose");

const SchoolFacility = require("@MEModels/schoolFacilityModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolFacilitiesGetRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get school facilities
 * @route   GET /school-admin/school-facilities
 * @access  School Admin
 */
const getSchoolFacilities = asyncHandler(async (req, res, next) => {
  const { school } = req.params;

  // Find school facilities that are is_active status value is true
  const schoolFacilities = await SchoolFacility.find({
    is_active: true,
    school: school,
  }).populate([
    {
      path: "created_by updated_by",
    },
    { path: "facility" },
  ]);

  // Send response
  res.status(200).json({
    data: schoolFacilities,
    message: schoolFacilitiesGetRequestSuccess,
    status: 200,
  });
});

module.exports = {
  getSchoolFacilities,
};
