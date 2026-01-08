const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const EmergencyContact = require("@MEModels/emergencyContactModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  emergencyContactDetailsRequired,
  emergencyContactDetailsIDRequired,
  emergencyContactDetailsPutRequestFail,
  emergencyContactDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage/emergencyContactProfileResponseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update emergency contact profile for student
 * @route   PUT /student/profile/emergency-contacts/:id
 * @access  Student
 */
const updateEmergencyContact = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        emergencyContactDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Validate emergency contact ID is provided
  if (!req.params.id) {
    return next(
      new ErrorResponse(
        emergencyContactDetailsIDRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Build update object with only provided fields
  const updateData = {
    ...(req.body.name && { name: req.body.name }),
    ...(req.body.relation && { relation: req.body.relation }),
    ...(req.body.phone_number && { phone_number: req.body.phone_number }),
    alternate_phone: req.body.alternate_phone || null,
    email: req.body.email || null,
    address: req.body.address || null,
    updated_by: req.user.id,
  };

  // Update emergency contact document
  const updatedEmergencyContact = await EmergencyContact.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // Check if emergency contact exists
  if (!updatedEmergencyContact) {
    return next(
      new ErrorResponse(
        emergencyContactDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Populate references for response
  const populatedEmergencyContact = await updatedEmergencyContact.populate([
    { path: "user" },
  ]);

  if (!populatedEmergencyContact) {
    // Send failure response
    return next(
      new ErrorResponse(
        emergencyContactDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [populatedEmergencyContact],
      message: emergencyContactDetailsPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
});

module.exports = { updateEmergencyContact };
