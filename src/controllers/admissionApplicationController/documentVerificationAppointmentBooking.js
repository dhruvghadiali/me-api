const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolAddress = require("@MEModels/schoolAddressModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");
const SchoolAdmissionDocument = require("@MEModels/schoolAdmissionDocumentModel");

const {
  admissionApplicationNotFound,
  admissionApplicationStatusMustBeUnderReview,
  admissionApplicationNotAuthorizedToChangeStatus,
  admissionApplicationVerificationDocumentListNotFound,
  admissionApplicationDocumentVerificationAppointmentBookingFail,
  admissionApplicationDocumentVerificationAppointmentBookingSuccess,
} = require("@MEHelpers/responseMessage");
const {
  HTTP_STATUS_CODES,
  ADMISSION_APPLICATION_STATUS,
} = require("@MEHelpers/enums");
const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Book document verification appointment
 * @route   PUT /school-admin/admission-applications/:id/document-verification-appointment-booking
 * @access  School Admin
 */
const documentVerificationAppointmentBooking = asyncHandler(
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

    // Check if application status is UNDER_REVIEW or APPROVED
    if (
      _.toLower(_.toString(application.status)) !==
      _.toLower(_.toString(ADMISSION_APPLICATION_STATUS.UNDER_REVIEW)) &&
      _.toLower(_.toString(application.status)) !==
        _.toLower(_.toString(ADMISSION_APPLICATION_STATUS.APPROVED))
    ) {
      return next(
        new ErrorResponse(
          admissionApplicationStatusMustBeUnderReview,
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

    // Get all admission documents for this school_academic_class
    const schoolAdmissionDocuments = await SchoolAdmissionDocument.find({
      school_academic_class: application.school_academic_class,
      is_active: true,
    }).select("_id");

    if (!schoolAdmissionDocuments || schoolAdmissionDocuments.length === 0) {
      return next(
        new ErrorResponse(
          admissionApplicationVerificationDocumentListNotFound,
          HTTP_STATUS_CODES.STATUS_400,
        ),
      );
    }

    // Initialize verified_documents with all required documents (is_verified: false)
    const verifiedDocuments = schoolAdmissionDocuments.map((doc) => ({
      school_admission_document: doc.id,
      is_verified: false,
      notes: "n/a",
    }));

    // Add appointment to document_verification_appointment array
    application.document_verification_appointment.push({
      scheduled_date,
      scheduled_time_slot,
      booked_at: new Date(),
      booked_by: req.user.id,
      remarks: remarks || "Document verification appointment scheduled",
    });

    application.verified_documents = verifiedDocuments;

    // Update status to DOCUMENTS_VERIFICATION_PENDING
    const previousStatus = application.status;
    const newStatus =
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING;
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

    application.updated_by = req.user.id;

    // Save application
    const response = await application.save();
    if (!response) {
      return next(
        new ErrorResponse(
          admissionApplicationDocumentVerificationAppointmentBookingFail,
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
    ]);

    // Send success response
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [response],
      message:
        admissionApplicationDocumentVerificationAppointmentBookingSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  },
);

module.exports = { documentVerificationAppointmentBooking };
