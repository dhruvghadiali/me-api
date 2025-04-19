// const FeeType = require("@MEModels/feeTypeModel");
// const ErrorResponse = require("@MEUtils/errorResponse");
// const responseMessage = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update organization
 * @route   PATCH /super-admin/schools/:id
 * @access  Super Admin
 */
exports.addSchool = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail added successfully",
  });
});

exports.getActiveSchoolAddressSchools = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail get successfully",
  });
});

exports.getSchools = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail get successfully",
  });
});

exports.getSchool = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail get successfully",
  });
});

exports.updateSchool = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail get successfully",
  });
});

exports.restoreSchool = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail get successfully",
  });
});

exports.deleteSchool = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    data: [],
    message: "School detail get successfully",
  });
});
