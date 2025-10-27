const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolAddress = require("@MEModels/schoolAddressModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const {
  HTTP_STATUS_CODES,
  ADMISSION_APPLICATION_STATUS,
} = require("@ME/helpers/enums/admissionEnums");
const {
  admissionApplicationNotFound,
  admissionApplicationNotAuthorizedToChangeStatus,
  admissionApplicationStatusMustBeDocumentsUnverified,
  admissionApplicationDocumentVerificationAppointmentRescheduleFail,
  admissionApplicationDocumentVerificationAppointmentRescheduleSuccess,
} = require("@MEHelpers/responseMessage");
const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Reschedule document verification appointment
 * @route   POST /school-admin/admission-applications/:id/reschedule-document-verification-appointment
 * @access  School Admin
 */
const rescheduleDocumentVerificationAppointment = asyncHandler(
  async (req, res, next) => {
    const { scheduled_date, scheduled_time_slot, remarks } = req.body;
    const { id } = req.params;

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

    // Check if application status is DOCUMENTS_UNVERIFIED
    if (
      _.toLower(_.toString(application.status)) !==
      _.toLower(_.toString(ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED))
    ) {
      return next(
        new ErrorResponse(
          admissionApplicationStatusMustBeDocumentsUnverified,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Verify school admin's school matches the application's school
    const schoolAcademicClass = await SchoolAcademicClass.findById(
      application.school_academic_class
    ).select("school");

    if (!schoolAcademicClass) {
      return next(
        new ErrorResponse(
          admissionApplicationNotAuthorizedToChangeStatus,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Get school admin's school from school_address
    const schoolAdminAddress = await SchoolAddress.findOne({
      user: req.user.id,
    }).select("school");

    if (!schoolAdminAddress) {
      return next(
        new ErrorResponse(
          admissionApplicationNotAuthorizedToChangeStatus,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Compare schools
    if (
      _.toLower(_.toString(schoolAcademicClass.school)) !==
      _.toLower(_.toString(schoolAdminAddress.school))
    ) {
      return next(
        new ErrorResponse(
          admissionApplicationNotAuthorizedToChangeStatus,
          HTTP_STATUS_CODES.STATUS_403
        )
      );
    }

    // Add appointment to document_verification_appointment array
    application.document_verification_appointment.push({
      scheduled_date,
      scheduled_time_slot,
      booked_at: new Date(),
      booked_by: req.user.id,
      remarks: remarks || "Document verification appointment rescheduled",
    });

    application.updated_by = req.user._id;

    // Save application
    const response = await application.save();
    if (!response) {
      return next(
        new ErrorResponse(
          admissionApplicationDocumentVerificationAppointmentRescheduleFail,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Populate the response with booked_by details
    // await response.populate([
    //   {
    //     path: "document_verification_appointment.booked_by",
    //     select: "first_name last_name",
    //   },
    // ]);

    // Send success response
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [response],
      message:
        admissionApplicationDocumentVerificationAppointmentRescheduleSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
);

module.exports = { rescheduleDocumentVerificationAppointment };
