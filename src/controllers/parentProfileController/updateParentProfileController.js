const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const ParentProfile = require("@MEModels/parentProfileModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  parentProfileDetailsRequired,
  parentProfileDetailsIDRequired,
  parentProfileDetailsPutRequestFail,
  parentProfileDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update parent profile for student
 * @route   PUT /student/profile/parent/:id
 * @access  Student
 */
const updateParentProfile = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        parentProfileDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Validate parent profile ID is provided
  if (!req.params.id) {
    return next(
      new ErrorResponse(
        parentProfileDetailsIDRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Build update object with only provided fields
  const updateData = {
    ...(req.body.first_name && { first_name: req.body.first_name }),
    ...(req.body.last_name && { last_name: req.body.last_name }),
    ...(req.body.phone_number && { phone_number: req.body.phone_number }),
    ...(req.body.email && { email: req.body.email }),
    ...(req.body.aadhaar_number && { aadhaar_number: req.body.aadhaar_number }),
    ...(req.body.occupation && { occupation: req.body.occupation }),
    ...(req.body.education && { education: req.body.education }),
    ...(req.body.parent_type && { parent_type: req.body.parent_type }),
    ...(typeof req.body.annual_income !== "undefined" && {
      annual_income: req.body.annual_income,
    }),
    ...(typeof req.body.same_address_as_student !== "undefined" && {
      same_address_as_student: req.body.same_address_as_student,
    }),
    ...(req.body.alive && {
      alive: {
        ...(typeof req.body.alive.status !== "undefined" && {
          status: req.body.alive.status,
        }),
        ...(req.body.alive.date_of_death && {
          date_of_death: req.body.alive.date_of_death,
        }),
        ...(req.body.alive.caring_child_by && {
          caring_child_by: req.body.alive.caring_child_by,
        }),
      },
    }),
    updated_by: req.user.id,
  };

  // Update parent profile document
  const updatedParentProfile = await ParentProfile.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // Check if parent profile exists
  if (!updatedParentProfile) {
    return next(
      new ErrorResponse(
        parentProfileDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Populate references for response
  const populatedParentProfile = await updatedParentProfile.populate([
    { path: "user" },
  ]);

  if (!populatedParentProfile) {
    // Send failure response
    return next(
      new ErrorResponse(
        parentProfileDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_500
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [populatedParentProfile],
      message: parentProfileDetailsPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
});

module.exports = { updateParentProfile };
