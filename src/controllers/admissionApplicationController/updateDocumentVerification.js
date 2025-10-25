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
const { validateDocumentNotesRequired } = require("@MEUtils/dbQuery");

/**
 * @desc    Update document verification details
 * @route   PUT /school-admin/admission-applications/:id/verify-documents
 * @access  School Admin
 */
const updateDocumentVerification = asyncHandler(async (req, res, next) => {
  const { verified_documents } = req.body;
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
  }).select("_id admission_document is_required");

  if (!schoolAdmissionDocuments || schoolAdmissionDocuments.length === 0) {
    return next(
      new ErrorResponse(
        "No admission documents found for this school academic class",
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Create a Set of valid school_admission_document IDs
  const validDocumentIds = new Set(
    schoolAdmissionDocuments.map((doc) => doc._id.toString())
  );

  // Validate verified_documents array
  if (!verified_documents || !Array.isArray(verified_documents)) {
    return next(
      new ErrorResponse(
        "verified_documents must be a valid array",
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Check if all documents in verified_documents array have required fields
  for (const verifiedDoc of verified_documents) {
    if (!verifiedDoc.school_admission_document) {
      return next(
        new ErrorResponse(
          "school_admission_document is required for each document",
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    if (typeof verifiedDoc.is_verified !== "boolean") {
      return next(
        new ErrorResponse(
          "is_verified must be a boolean value for each document",
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }

    if (verifiedDoc.notes === undefined) {
      return next(
        new ErrorResponse(
          "notes field is required for each document (can be empty string)",
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }
  }

  // Extract submitted document IDs
  const submittedDocumentIds = verified_documents.map((doc) =>
    doc.school_admission_document.toString()
  );

  // Check for duplicate IDs in submitted array
  const duplicateIds = submittedDocumentIds.filter(
    (item, index) => submittedDocumentIds.indexOf(item) !== index
  );

  if (duplicateIds.length > 0) {
    return next(
      new ErrorResponse(
        `Duplicate document IDs found: ${duplicateIds.join(", ")}`,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Check for invalid document IDs (not in the valid list)
  const invalidDocumentIds = submittedDocumentIds.filter(
    (id) => !validDocumentIds.has(id)
  );

  if (invalidDocumentIds.length > 0) {
    return next(
      new ErrorResponse(
        `Invalid document IDs found that are not associated with this school academic class: ${invalidDocumentIds.join(
          ", "
        )}`,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Check for missing document IDs (all required documents must be present)
  const missingDocumentIds = Array.from(validDocumentIds).filter(
    (id) => !submittedDocumentIds.includes(id)
  );

  if (missingDocumentIds.length > 0) {
    return next(
      new ErrorResponse(
        `Missing required document IDs: ${missingDocumentIds.join(
          ", "
        )}. All admission documents must be included in the verification.`,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Validate that required documents that are not verified have notes
  for (const verifiedDoc of verified_documents) {
    const isValid = await validateDocumentNotesRequired(
      verifiedDoc.notes,
      verifiedDoc.is_verified,
      verifiedDoc.school_admission_document
    );

    if (!isValid) {
      return next(
        new ErrorResponse(
          `Notes are required for unverified required document: ${verifiedDoc.school_admission_document}`,
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }
  }

  // All validations passed, update verified_documents
  application.verified_documents = verified_documents;
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
  ]);

  // Send success response
  res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [response],
    message: admissionApplicationPutRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = { updateDocumentVerification };
