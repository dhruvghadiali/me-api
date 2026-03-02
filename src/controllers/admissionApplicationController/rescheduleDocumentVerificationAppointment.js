const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolAddress = require("@MEModels/schoolAddressModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const {
  HTTP_STATUS_CODES,
  ADMISSION_APPLICATION_STATUS,
} = require("@MEHelpers/enums");
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
          HTTP_STATUS_CODES.STATUS_400,
        ),
      );
    }

    // Check if application status is DOCUMENTS_UNVERIFIED or DOCUMENTS_VERIFICATION_PENDING
    const allowedStatuses = [
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
    ];

    if (
      !_.includes(
        _.map(allowedStatuses, (allowedStatus) =>
          _.toLower(_.toString(allowedStatus)),
        ),
        _.toLower(_.toString(application.status)),
      )
    ) {
      return next(
        new ErrorResponse(
          admissionApplicationStatusMustBeDocumentsUnverified,
          HTTP_STATUS_CODES.STATUS_400,
        ),
      );
    }

    // Verify school admin's school matches the application's school
    const schoolAcademicClass = await SchoolAcademicClass.findById(
      application.school_academic_class,
    ).select("school");

    if (!schoolAcademicClass) {
      return next(
        new ErrorResponse(
          admissionApplicationNotAuthorizedToChangeStatus,
          HTTP_STATUS_CODES.STATUS_400,
        ),
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
          HTTP_STATUS_CODES.STATUS_400,
        ),
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
          HTTP_STATUS_CODES.STATUS_403,
        ),
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

    // Update status to DOCUMENTS_UNVERIFIED
    const previousStatus = application.status;
    const newStatus =
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED;
    application.status = newStatus;

    // Add to status history
    application.status_history.push({
      status: newStatus,
      changed_by: req.user.id,
      changed_at: new Date(),
      remarks:
        remarks ||
        `Status changed from ${previousStatus} to ${newStatus} - Document verification appointment scheduled`,
    });

    application.updated_by = req.user._id;

    // Save application
    const response = await application.save();
    if (!response) {
      return next(
        new ErrorResponse(
          admissionApplicationDocumentVerificationAppointmentRescheduleFail,
          HTTP_STATUS_CODES.STATUS_400,
        ),
      );
    }

    // Populate the response with document details
    await response.populate([
      {
        path: "verified_documents",
        populate: [
          {
            path: "school_admission_document",
            populate: {
              path: "admission_document",
              select: ["_id", "admission_document"],
            },
            select: ["_id", "admission_document", "is_required"],
          },
        ],
      },
      {
        path: "document_verification_appointment",
        populate: {
          path: "booked_by",
          select: ["_id", "username", "first_name", "last_name"],
        },
      },
      {
        path: "status_history.changed_by",
        select: ["_id", "username", "first_name", "last_name"],
      },
    ]);

    // Send success response
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [response],
      message:
        admissionApplicationDocumentVerificationAppointmentRescheduleSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  },
);

module.exports = { rescheduleDocumentVerificationAppointment };
