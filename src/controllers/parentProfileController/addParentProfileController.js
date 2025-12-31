const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const ParentProfile = require("@MEModels/parentProfileModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  parentProfileDetailsRequired,
  parentProfileDetailsPostRequestFail,
  parentProfileDetailsPostRequestSuccess,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Create new parent profile for student
 * @route   POST /student/profile/parent
 * @access  Student
 */
const addParentProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        parentProfileDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Create new parent profile document with data from req.body
  const newParentProfile = await ParentProfile.create({
    ...req.body,
    user: id, // Assuming user is attached to request by auth middleware
    created_by: id,
    updated_by: id,
  });

  // Populate references for response
  const populatedParentProfile = await newParentProfile;

  if (!populatedParentProfile) {
    // Send failure response
    return next(
      new ErrorResponse(
        parentProfileDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Send success response
  return res.status(HTTP_STATUS_CODES.STATUS_201).json({
    data: [populatedParentProfile],
    message: parentProfileDetailsPostRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_201,
  });
});

module.exports = { addParentProfile };
