const FacilityType = require("@MEModels/facilityTypeModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  facilityTypePutRequestFail,
  facilityTypePostRequestFail,
  facilityTypeDeleteRequestFail,
  facilityTypePutRequestSuccess,
  facilityTypesGetRequestSuccess,
  facilityTypePostRequestSuccess,
  facilityTypeDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all facility types
 * @route   GET /super-admin/facility-types
 * @access  Super Admin
 */
const getFacilityTypes = asyncHandler(async (req, res, next) => {
  // Find facility types that are active status and sort them by facility_type
  const facilityTypes = await FacilityType.find({
    is_active: true,
  })
    .select([
      "facility_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ facility_type: 1 });

  // Send response
  res.status(200).json({
    data: facilityTypes,
    message: facilityTypesGetRequestSuccess,
  });
});

/**
 * @desc    Add new facility type
 * @route   POST /super-admin/facility-types
 * @access  Super Admin
 */
const addFacilityType = asyncHandler(async (req, res, next) => {
  let response;
  const { facility_type } = req.body;
  const { id } = req.user;

  // Find facility type that is_active status false
  const facilityTypeInfo = await FacilityType.findOne({
    facility_type: facility_type ? facility_type : "",
    is_active: false,
  });

  if (facilityTypeInfo) {
    // If facility type is already present, update the is_active status to true with the user who signin
    response = await FacilityType.findByIdAndUpdate(
      facilityTypeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If facility type is not present, create a new facility type with the user who signin
    response = await FacilityType.create({
      facility_type,
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
      message: facilityTypePostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(facilityTypePostRequestFail, 400));
  }
});

/**
 * @desc    Update facility type
 * @route   PUT /super-admin/facility-types/:id
 * @access  Super Admin
 */
const updateFacilityType = asyncHandler(async (req, res, next) => {
  const { facility_type } = req.body;
  const { id } = req.user;

  // Find facility type id and update facility type with user who signin
  const facilityTypeInfo = await FacilityType.findByIdAndUpdate(
    req.params.id,
    { facility_type, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "facility_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (facilityTypeInfo) {
    res.status(200).json({
      data: [facilityTypeInfo],
      message: facilityTypePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(facilityTypePutRequestFail, 400));
  }
});

/**
 * @desc    Delete facility type
 * @route   DELETE /super-admin/facility-types/:id
 * @access  Super Admin
 */
const deleteFacilityType = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find facility type id and update is active status to false
  const facilityTypeInfo = await FacilityType.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (facilityTypeInfo) {
    res.status(200).json({
      data: [],
      message: facilityTypeDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(facilityTypeDeleteRequestFail, 400));
  }
});

module.exports = {
  addFacilityType,
  getFacilityTypes,
  updateFacilityType,
  deleteFacilityType,
};
