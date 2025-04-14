// const FeeType = require("@MEModels/feeTypeModel");
// const ErrorResponse = require("@MEUtils/errorResponse");
// const responseMessage = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update organization
 * @route   PATCH /super-admin/school-admin/forgotten-password/:id
 * @access  Super Admin
 */
exports.schoolAdminForgottenPassword = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School updated successfully",
  });
});
