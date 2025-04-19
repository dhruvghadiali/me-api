// const FeeType = require("@MEModels/feeTypeModel");
// const ErrorResponse = require("@MEUtils/errorResponse");
// const responseMessage = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update school address
 * @route   PUT /super-admin/school-address/:id
 * @access  Super Admin
 */
exports.updateSchoolAddress = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School address updated successfully",
  });
});

/**
 * @desc    Restore school address
 * @route   PATCH /super-admin/school-address/:id
 * @access  Super Admin
 */
exports.restoreSchoolAddress = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School address restore successfully",
  });
});

/**
 * @desc    Delete school address
 * @route   DELETE /super-admin/school-address/:id
 * @access  Super Admin
 */
exports.deleteSchoolAddress = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School address deleted successfully",
  });
});
