const Facility = require("@MEModels/facilityModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  facilityPutRequestFail,
  facilityPostRequestFail,
  facilityDeleteRequestFail,
  facilityPutRequestSuccess,
  facilityPostRequestSuccess,
  facilitiesGetRequestSuccess,
  facilityDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get facilities
 * @route   POST /super-admin/facilities
 * @access  Super Admin
 */
const getFacilities = asyncHandler(async (req, res, next) => {
  // Find facilities that are is_active status value is true and sort them by facility name
  const facilities = await Facility.find({
    is_active: true,
  })
    .select([
      "facility_name",
      "facility_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate([
      { path: "created_by updated_by" },
      {
        path: "facility_type",
        select: [
          "facility_type",
          "created_at",
          "updated_at",
          "created_by",
          "updated_by",
        ],
        populate: "created_by updated_by",
      },
    ])
    .sort({ facility_name: 1 });

  // Send response
  res.status(200).json({
    data: facilities,
    message: facilitiesGetRequestSuccess,
  });
});

/**
 * @desc    Add facility
 * @route   POST /super-admin/facilities
 * @access  Super Admin
 */
const addFacility = asyncHandler(async (req, res, next) => {
  let response;
  const { facility_name, facility_type } = req.body;
  const { id } = req.user;

  // Find facility that has is_active status value is false
  const facilityInfo = await Facility.findOne({
    facility_name: facility_name ? facility_name : "",
    facility_type: facility_type ? facility_type : "",
    is_active: false,
  });

  if (facilityInfo) {
    // If facility is already present, update the is_active status value to true with the user who signin
    response = await Facility.findByIdAndUpdate(
      facilityInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If facility is not present, create a new facility with the user who signin
    response = await Facility.create({
      facility_name,
      facility_type,
      created_by: id,
      updated_by: id,
    });
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    // Populate the created_by and updated_by username
    await response.populate("created_by updated_by");

    res.status(201).json({
      data: [response],
      message: facilityPostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(facilityPostRequestFail, 400));
  }
});

/**
 * @desc    Update facility
 * @route   POST /super-admin/facilities/:id
 * @access  Super Admin
 */
const updateFacility = asyncHandler(async (req, res, next) => {
  const { facility_name, facility_type } = req.body;
  const { id } = req.user;

  // Find facility id and update facility info with user who signin
  const facility = await Facility.findByIdAndUpdate(
    req.params.id,
    { facility_name, facility_type, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .select([
      "facility_name",
      "facility_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by");

  if (facility) {
    // Send response
    res.status(200).json({
      data: [facility],
      message: facilityPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(facilityPutRequestFail, 400));
  }
});

/**
 * @desc    Delete facility
 * @route   DELETE /super-admin/facilities/:id
 * @access  Super Admin
 */
const deleteFacility = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find facility id and update is_active status to false
  const facility = await Facility.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (facility) {
    // Send response
    res.status(200).json({
      data: [],
      message: facilityDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(facilityDeleteRequestFail, 400));
  }
});

module.exports = {
  addFacility,
  getFacilities,
  updateFacility,
  deleteFacility,
};
