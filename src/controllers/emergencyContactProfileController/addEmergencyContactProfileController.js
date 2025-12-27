const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const EmergencyContact = require("@MEModels/emergencyContactModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  emergencyContactDetailsRequired,
  emergencyContactDetailsPostRequestFail,
  emergencyContactDetailsPostRequestSuccess,
} = require("@MEHelpers/responseMessage/emergencyContactProfileResponseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Create new emergency contact profile for student
 * @route   POST /student/profile/emergency-contacts
 * @access  Student
 */
const addEmergencyContact = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        emergencyContactDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Create new emergency contact document with data from req.body
  const newEmergencyContact = await EmergencyContact.create({
    ...req.body,
    user: req.user.id,
  });

  // Populate references for response
  const populatedEmergencyContact = await newEmergencyContact.populate([
    { path: "user" },
  ]);

  if (!populatedEmergencyContact) {
    // Send failure response
    return next(
      new ErrorResponse(
        emergencyContactDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: [populatedEmergencyContact],
      message: emergencyContactDetailsPostRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  }
});

module.exports = { addEmergencyContact };
