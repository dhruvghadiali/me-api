const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const SchoolAdmissionDocument = require("@MEModels/schoolAdmissionDocumentModel");

const {
  ADMISSION_APPLICATION_STATUS,
} = require("@ME/helpers/enums/admissionEnums");
const {
  admissionApplicationNotFound,
  admissionApplicationNotAuthorizedToChangeStatus,
  admissionApplicationPutRequestFail,
  admissionApplicationPutRequestSuccess,
} = require("@MEHelpers/responseMessage");
const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");

/**
 * @desc    Book document verification appointment
 * @route   PUT /school-admin/admission-applications/:id/book-document-verification-appointment
 * @access  School Admin
 */
const bookDocumentVerificationAppointment = asyncHandler(
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

    // Check if application status is UNDER_REVIEW
    if (
      _.toLower(_.toString(application.status)) !==
      _.toLower(_.toString(ADMISSION_APPLICATION_STATUS.UNDER_REVIEW))
    ) {
      return next(
        new ErrorResponse(
          `Cannot book document verification appointment. Application status must be ${ADMISSION_APPLICATION_STATUS.UNDER_REVIEW}`,
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

    // Get all admission documents for this school_academic_class
    const schoolAdmissionDocuments = await SchoolAdmissionDocument.find({
      school_academic_class: application.school_academic_class,
      is_active: true,
    })
      .select("_id admission_document is_required notes")
      .populate("admission_document", "document_name");

    if (!schoolAdmissionDocuments || schoolAdmissionDocuments.length === 0) {
      return next(
        new ErrorResponse(
          "No admission documents found for this school academic class",
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    // Initialize verified_documents with all required documents (is_verified: false)
    const verifiedDocuments = schoolAdmissionDocuments.map((doc) => ({
      school_admission_document: doc._id,
      is_verified: false,
      notes: "n/a",
    }));

    // Add appointment to document_verification_appointment array
    application.document_verification_appointment.push({
      scheduled_date,
      scheduled_time_slot,
      booked_at: new Date(),
      booked_by: req.user._id,
      remarks: remarks || "Document verification appointment scheduled",
    });

    application.verified_documents = verifiedDocuments;

    // Update status to DOCUMENTS_VERIFICATION_PENDING
    const previousStatus = application.status;
    application.status =
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING;

    // Add to status history
    application.status_history.push({
      status: ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
      changed_by: req.user._id,
      changed_at: new Date(),
      remarks:
        remarks ||
        `Status changed from ${previousStatus} to ${ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING} - Document verification appointment scheduled`,
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

    // Populate the response with document details
    await response.populate([
      {
        path: "verified_documents.school_admission_document",
        populate: {
          path: "admission_document",
          select: "document_name",
        },
      },
      {
        path: "document_verification_appointment.booked_by",
        select: "first_name last_name",
      },
    ]);

    // Send success response
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [response],
      message: admissionApplicationPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
);

module.exports = { bookDocumentVerificationAppointment };
