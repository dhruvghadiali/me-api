const SchoolType = require("@MEModels/schoolTypeModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const responseMessage = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all school types
 * @route   GET /super-admin/school-types
 * @access  Super Admin
 */
const getSchoolTypes = asyncHandler(async (req, res, next) => {
  // Find school types that are active status and sort them by school_type
  const schoolTypes = await SchoolType.find({
    is_active: true,
  })
    .select([
      "school_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ school_type: 1 });

  // Send response
  res.status(200).json({
    data: schoolTypes,
    message: schoolTypeGetRequestSuccess,
  });
});

/**
 * @desc    Add new school type
 * @route   POST /super-admin/school-types
 * @access  Super Admin
 */
const addSchoolType = asyncHandler(async (req, res, next) => {
  let response;
  const { school_type } = req.body;
  const { id } = req.user;

  // Find school type that is_active status false
  const schoolTypeInfo = await SchoolType.findOne({
    school_type: school_type ? school_type : "",
    is_active: false,
  });

  if (schoolTypeInfo) {
    // If school type is already present, update the is_active status to true with the user who signin
    response = await SchoolType.findByIdAndUpdate(
      schoolTypeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If school type is not present, create a new school type with the user who signin
    response = await SchoolType.create({
      school_type,
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
      message: schoolTypePostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolTypePostRequestFail, 400));
  }
});

/**
 * @desc    Update school type
 * @route   PUT /super-admin/school-types/:id
 * @access  Super Admin
 */
const updateSchoolType = asyncHandler(async (req, res, next) => {
  const { school_type } = req.body;
  const { id } = req.user;

  // Find school type id and update school type with user who signin
  const schoolTypeInfo = await SchoolType.findByIdAndUpdate(
    req.params.id,
    { school_type, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "school_type",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (schoolTypeInfo) {
    res.status(200).json({
      data: [schoolTypeInfo],
      message: schoolTypePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolTypePutRequestFail, 400));
  }
});

/**
 * @desc    Delete school type
 * @route   DELETE /super-admin/school-types/:id
 * @access  Super Admin
 */
const deleteSchoolType = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school type id and update is active status to false
  const schoolTypeInfo = await SchoolType.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (schoolTypeInfo) {
    res.status(200).json({
      data: [],
      message: schoolTypeDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolTypeDeleteRequestFail, 400));
  }
});

module.exports = {
  addSchoolType,
  getSchoolTypes,
  updateSchoolType,
  deleteSchoolType,
};
