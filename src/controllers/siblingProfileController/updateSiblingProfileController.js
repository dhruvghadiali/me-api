const _ = require("lodash");

const ErrorResponse = require("@MEUtils/errorResponse");
const SiblingProfile = require("@MEModels/siblingProfileModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  siblingProfileDetailsRequired,
  siblingProfileDetailsIDRequired,
  siblingProfileDetailsPutRequestFail,
  siblingProfileDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update sibling profile for student
 * @route   PUT /student/profile/siblings/:id
 * @access  Student
 */
const updateSiblingProfile = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        siblingProfileDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Validate sibling profile ID is provided
  if (!req.params.id) {
    return next(
      new ErrorResponse(
        siblingProfileDetailsIDRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Build update object with only provided fields
  const updateData = {
    ...(req.body.first_name && { first_name: req.body.first_name }),
    ...(req.body.last_name && { last_name: req.body.last_name }),
    ...(req.body.gender && { gender: req.body.gender }),
    ...(req.body.date_of_birth && { date_of_birth: req.body.date_of_birth }),
    ...(req.body.studying_in_class && {
      studying_in_class: req.body.studying_in_class,
    }),
    ...(typeof req.body.same_school !== "undefined" && {
      same_school: req.body.same_school,
    }),
    ...(req.body.school_name && { school_name: req.body.school_name }),
    ...(req.body.admission_number && {
      admission_number: req.body.admission_number,
    }),
    updated_by: req.user.id,
  };

  // Update sibling profile document
  const updatedSiblingProfile = await SiblingProfile.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // Check if sibling profile exists
  if (!updatedSiblingProfile) {
    return next(
      new ErrorResponse(
        siblingProfileDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Populate references for response
  const populatedSiblingProfile = await updatedSiblingProfile.populate([
    { path: "user" },
    { path: "studying_in_class" },
  ]);

  if (!populatedSiblingProfile) {
    // Send failure response
    return next(
      new ErrorResponse(
        siblingProfileDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [populatedSiblingProfile],
      message: siblingProfileDetailsPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
});

module.exports = { updateSiblingProfile };
