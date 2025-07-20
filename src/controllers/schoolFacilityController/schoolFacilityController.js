const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolFacility = require("@MEModels/schoolFacilityModel");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolFacilityPostRequestFail,
  schoolFacilityDeleteRequestFail,
  schoolFacilityPostRequestSuccess,
  schoolFacilitiesGetRequestSuccess,
  schoolFacilityDeleteRequestSuccess,
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

/**
 * @desc    Add new school facility
 * @route   POST /school-admin/school-facilities
 * @access  Super Admin
 */
const addSchoolFacility = asyncHandler(async (req, res, next) => {
  let response;
  const { school, facility } = req.body;
  const { id } = req.user;

  // Find facility and school that has is_active status value is false
  const schoolFacilityInfo = await SchoolFacility.findOne({
    school: school ? school : "",
    facility: facility ? facility : "",
    is_active: false,
  });

  if (
    schoolFacilityInfo &&
    schoolFacilityInfo.id &&
    schoolFacilityInfo.is_active === false
  ) {
    // If school facility is already present, update the is_active status value to true with the user who signin
    response = await SchoolFacility.findByIdAndUpdate(
      schoolFacilityInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If school facility is not present, create a new school facility with the user who signin
    response = await SchoolFacility.create({
      school: school,
      facility: facility,
      created_by: id,
      updated_by: id,
    });
  }

  // If response is present, remove the unused property from the response and populate the created_by and updated_by username
  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    // Populate the created_by and updated_by username
    await response.populate("created_by updated_by");

    // Send response
    res.status(201).json({
      data: [response],
      message: schoolFacilityPostRequestSuccess,
      status: 201,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolFacilityPostRequestFail, 400));
  }
});

/**
 * @desc    Delete school facility
 * @route   DELETE /school-admin/school-facilities/:id
 * @access  Super Admin
 */
const deleteSchoolFacility = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school facility id and update is active status to false
  const schoolFacilityInfo = await SchoolFacility.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (schoolFacilityInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: schoolFacilityDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolFacilityDeleteRequestFail, 400));
  }
});

module.exports = {
  addSchoolFacility,
  getSchoolFacilities,
  deleteSchoolFacility,
};
