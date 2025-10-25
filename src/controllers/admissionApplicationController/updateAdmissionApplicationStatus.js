const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");

const {
  admissionApplicationNotFound,
  admissionApplicationNotAuthorizedToChangeStatus,
  admissionApplicationPutRequestFail,
  admissionApplicationPutRequestSuccess,
} = require("@MEHelpers/responseMessage");
const {
  ADMISSION_APPLICATION_STATUS,
} = require("@ME/helpers/enums/admissionEnums");
const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES, USER_TYPES } = require("@ME/helpers/enums");

/**
 * Status transition rules
 * Student transitions:
 *        DRAFT -> SUBMITTED
 *        SUBMITTED -> CANCELLED
 *        UNDER_REVIEW -> CANCELLED
 *        DOCUMENTS_VERIFICATION_PENDING -> CANCELLED
 *        APPROVED -> WITHDRAWN
 * School Admin transitions:
 *        SUBMITTED -> UNDER_REVIEW
 *        DOCUMENTS_VERIFICATION_PENDING -> DOCUMENTS_VERIFIED | DOCUMENTS_UNVERIFIED
 *        DOCUMENTS_VERIFIED -> APPROVED | REJECTED
 *        APPROVED -> REJECTED
 *        FEES_PAID -> SELECTED | REJECTED
 *        SELECTED -> REJECTED
 */

const STUDENT_ALLOWED_TRANSITIONS = {
  [ADMISSION_APPLICATION_STATUS.DRAFT]: [
    ADMISSION_APPLICATION_STATUS.SUBMITTED,
  ],
  [ADMISSION_APPLICATION_STATUS.SUBMITTED]: [
    ADMISSION_APPLICATION_STATUS.CANCELLED,
  ],
  [ADMISSION_APPLICATION_STATUS.UNDER_REVIEW]: [
    ADMISSION_APPLICATION_STATUS.CANCELLED,
  ],
  [ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING]: [
    ADMISSION_APPLICATION_STATUS.CANCELLED,
  ],
  [ADMISSION_APPLICATION_STATUS.APPROVED]: [
    ADMISSION_APPLICATION_STATUS.WITHDRAWN,
  ],
};

const SCHOOL_ADMIN_ALLOWED_TRANSITIONS = {
  [ADMISSION_APPLICATION_STATUS.SUBMITTED]: [
    ADMISSION_APPLICATION_STATUS.UNDER_REVIEW,
  ],
  [ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING]: [
    ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED,
    ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
  ],
  [ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED]: [
    ADMISSION_APPLICATION_STATUS.APPROVED,
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
  [ADMISSION_APPLICATION_STATUS.APPROVED]: [
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
  [ADMISSION_APPLICATION_STATUS.FEES_PAID]: [
    ADMISSION_APPLICATION_STATUS.SELECTED,
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
  [ADMISSION_APPLICATION_STATUS.SELECTED]: [
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
};

/**
 * @desc    Update admission application status
 * @route   PUT /student/admission-applications/:id/status
 *          PUT /school-admin/admission-applications/:id/status
 * @access  Student/School Admin
 */
const updateAdmissionApplicationStatus = asyncHandler(
  async (req, res, next) => {
    const { status, remarks } = req.body;
    const { id } = req.params;
    const userRole = req.user.user_type;

    // Find application
    const application = await AdmissionApplication.findById(id);
    if (!application) {
      return next(
        new ErrorResponse(
          admissionApplicationNotFound,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Validate user role
    if (
      userRole !== USER_TYPES.STUDENT &&
      userRole !== USER_TYPES.SCHOOL_ADMIN
    ) {
      return next(
        new ErrorResponse(
          admissionApplicationNotAuthorizedToChangeStatus,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    const currentStatus = application.status;
    let allowedTransitions = [];

    // Handle student role
    if (userRole === USER_TYPES.STUDENT) {
      // Verify student owns this application
      if (
        _.toLower(_.toString(application.applicant_user)) !==
        _.toLower(_.toString(req.user._id))
      ) {
        return next(
          new ErrorResponse(
            admissionApplicationNotAuthorizedToChangeStatus,
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }
      allowedTransitions = STUDENT_ALLOWED_TRANSITIONS[currentStatus] || [];
    }

    // Handle school admin role
    if (userRole === USER_TYPES.SCHOOL_ADMIN) {
      // Verify school admin's school matches the application's school
      const schoolAcademicClass = await SchoolAcademicClass.findById(
        application.school_academic_class
      ).select("school");

      if (!schoolAcademicClass) {
        return next(
          new ErrorResponse(
            "School academic class not found",
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }

      // Get school admin's school from school_address
      const schoolAdminSchool = req.user.school_address?.school;

      if (!schoolAdminSchool) {
        return next(
          new ErrorResponse(
            "School admin school information not found",
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }

      // Compare schools
      if (
        _.toLower(_.toString(schoolAcademicClass.school)) !==
        _.toLower(_.toString(schoolAdminSchool))
      ) {
        return next(
          new ErrorResponse(
            admissionApplicationNotAuthorizedToChangeStatus,
            HTTP_STATUS_CODES.STATUS_403
          )
        );
      }

      allowedTransitions =
        SCHOOL_ADMIN_ALLOWED_TRANSITIONS[currentStatus] || [];
    }

    // Check if status transition is allowed
    if (!allowedTransitions.includes(status)) {
      return next(
        new ErrorResponse(
          `Cannot transition from ${currentStatus} to ${status} for current user role`,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Additional validation: Check if student is already selected for another school in the same academic session
    if (status === ADMISSION_APPLICATION_STATUS.SELECTED) {
      const existingSelectedApplication = await AdmissionApplication.findOne({
        applicant_user: application.applicant_user,
        academic_session: application.academic_session,
        status: ADMISSION_APPLICATION_STATUS.SELECTED,
        _id: { $ne: application._id }, // Exclude current application
      });

      if (existingSelectedApplication) {
        return next(
          new ErrorResponse(
            `Student is already selected for another school in academic session ${application.academic_session}`,
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }
    }

    // Update status and add to history
    application.status = status;
    application.status_history.push({
      status,
      changed_by: req.user._id,
      changed_at: new Date(),
      remarks: remarks || `Status changed to ${status}`,
    });
    application.updated_by = req.user._id;

    // Save application
    const response = await application.save();
    if (!response) {
      return next(
        new ErrorResponse(
          admissionApplicationPutRequestFail,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [response],
      message: admissionApplicationPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
);

module.exports = { updateAdmissionApplicationStatus };
