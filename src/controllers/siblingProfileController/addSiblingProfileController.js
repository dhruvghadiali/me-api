const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const SiblingProfile = require("@MEModels/siblingProfileModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  siblingProfileDetailsRequired,
  siblingProfileDetailsPostRequestFail,
  siblingProfileDetailsPostRequestSuccess,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Create new sibling profile for student
 * @route   POST /student/profile/siblings
 * @access  Student
 */
const addSiblingProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        siblingProfileDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Create new sibling profile document with data from req.body
  const newSiblingProfile = await SiblingProfile.create({
    ...req.body,
    user: id, // Assuming user is attached to request by auth middleware
    created_by: id,
    updated_by: id,
  });

  // Populate references for response
  const populatedSiblingProfile = await newSiblingProfile;

  if (!populatedSiblingProfile) {
    // Send failure response
    return next(
      new ErrorResponse(
        siblingProfileDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Send success response
  return res.status(HTTP_STATUS_CODES.STATUS_201).json({
    data: [populatedSiblingProfile],
    message: siblingProfileDetailsPostRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_201,
  });
});

module.exports = { addSiblingProfile };
