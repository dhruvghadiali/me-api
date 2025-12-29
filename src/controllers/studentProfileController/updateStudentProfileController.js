const _ = require("lodash");

const ErrorResponse = require("@MEUtils/errorResponse");
const StudentProfile = require("@MEModels/studentProfileModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  studentProfileDetailsRequired,
  studentProfileDetailsIDRequired,
  studentProfileDetailsPutRequestFail,
  studentProfileDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update student profile for user
 * @route   PUT /student/profile/:id
 * @access  Student
 */
const updateStudentProfile = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(
        studentProfileDetailsRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Validate student profile ID is provided
  if (!req.params.id) {
    return next(
      new ErrorResponse(
        studentProfileDetailsIDRequired,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Build update object with only provided fields
  const updateData = {
    ...(req.body.date_of_birth && { date_of_birth: req.body.date_of_birth }),
    ...(req.body.gender && { gender: req.body.gender }),
    ...(req.body.blood_group && { blood_group: req.body.blood_group }),
    ...(req.body.aadhaar_number && { aadhaar_number: req.body.aadhaar_number }),
    ...(req.body.nationality && { nationality: req.body.nationality }),
    ...(req.body.photo_url && { photo_url: req.body.photo_url }),
    ...(req.body.medical_info && {
      medical_info: {
        ...(typeof req.body.medical_info.has_hearing_issue !== "undefined" && {
          has_hearing_issue: req.body.medical_info.has_hearing_issue,
        }),
        ...(req.body.medical_info.hearing_issue_details && {
          hearing_issue_details: req.body.medical_info.hearing_issue_details,
        }),
        ...(typeof req.body.medical_info.has_vision_issue !== "undefined" && {
          has_vision_issue: req.body.medical_info.has_vision_issue,
        }),
        ...(req.body.medical_info.vision_issue_details && {
          vision_issue_details: req.body.medical_info.vision_issue_details,
        }),
        ...(typeof req.body.medical_info.has_physical_issue !== "undefined" && {
          has_physical_issue: req.body.medical_info.has_physical_issue,
        }),
        ...(req.body.medical_info.physical_issue_details && {
          physical_issue_details: req.body.medical_info.physical_issue_details,
        }),
        ...(typeof req.body.medical_info.has_mental_issue !== "undefined" && {
          has_mental_issue: req.body.medical_info.has_mental_issue,
        }),
        ...(req.body.medical_info.mental_issue_details && {
          mental_issue_details: req.body.medical_info.mental_issue_details,
        }),
        ...(typeof req.body.medical_info.has_allergies !== "undefined" && {
          has_allergies: req.body.medical_info.has_allergies,
        }),
        ...(req.body.medical_info.allergies && {
          allergies: req.body.medical_info.allergies,
        }),
      },
    }),
    updated_by: req.user.id,
  };

  // Update student profile document
  const updatedStudentProfile = await StudentProfile.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // Check if student profile exists
  if (!updatedStudentProfile) {
    return next(
      new ErrorResponse(
        studentProfileDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Populate references for response
  const populatedStudentProfile = await updatedStudentProfile.populate([
    { path: "user" },
  ]);

  if (!populatedStudentProfile) {
    // Send failure response
    return next(
      new ErrorResponse(
        studentProfileDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [populatedStudentProfile],
      message: studentProfileDetailsPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
});

module.exports = { updateStudentProfile };
