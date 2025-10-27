const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const {
  HTTP_STATUS_CODES,
  ADMISSION_APPLICATION_STATUS,
} = require("@MEHelpers/enums/admissionEnums");
const {
  admissionApplicationNotFound,
  admissionApplicationVerifiedDocumentFail,
  admissionApplicationVerifiedDocumentSuccess,
  admissionApplicationVerifiedDocumentListMissing,
  admissionApplicationNotAuthorizedToChangeStatus,
  admissionApplicationDocumentVerificationStatusInvalid,
} = require("@MEHelpers/responseMessage");
const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update document verification details
 * @route   PUT /school-admin/admission-applications/:id/verified-documents
 * @access  School Admin
 */
const updateVerifiedDocuments = asyncHandler(async (req, res, next) => {
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

  // Check if application status is DOCUMENTS_VERIFICATION_PENDING or DOCUMENTS_UNVERIFIED
  const allowedStatuses = [
    ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
    ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
  ];

  if (
    !_.includes(
      _.map(allowedStatuses, (allowedStatus) =>
        _.toLower(_.toString(allowedStatus))
      ),
      _.toLower(_.toString(application.status))
    )
  ) {
    return next(
      new ErrorResponse(
        admissionApplicationDocumentVerificationStatusInvalid,
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

  // Get all school_admission_document IDs from application's verified_documents
  const existingDocumentIds = _.map(application.verified_documents, (doc) =>
    _.toString(doc.school_admission_document)
  );

  // Get all school_admission_document IDs from request
  const requestDocumentIds = _.map(verified_documents, (doc) =>
    _.toString(doc.school_admission_document)
  );

  // Check if all existing document IDs are present in request
  const missingDocumentIds = _.difference(
    existingDocumentIds,
    requestDocumentIds
  );

  if (!_.isEmpty(missingDocumentIds)) {
    return next(
      new ErrorResponse(
        admissionApplicationVerifiedDocumentListMissing,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Update verified_documents
  const newStatus = ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED;
  const previousStatus = application.status;

  application.verified_documents = verified_documents;
  application.updated_by = req.user.id;
  application.status = newStatus;

  // Add to status history
  application.status_history.push({
    status: newStatus,
    changed_by: req.user.id,
    changed_at: new Date(),
    remarks: `Status changed from ${previousStatus} to ${newStatus} - Document verification completed`,
  });

  // Save application
  const response = await application.save();
  if (!response) {
    return next(
      new ErrorResponse(
        admissionApplicationVerifiedDocumentFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Populate and send response
  // const populatedResponse = await AdmissionApplication.findById(response._id)
  //   .populate({
  //     path: "school_academic_class",
  //     populate: [
  //       { path: "school" },
  //       { path: "academic_class" },
  //       { path: "education_board" },
  //     ],
  //   })
  //   .populate({
  //     path: "verified_documents.school_admission_document",
  //   })
  //   .populate("applicant_user");

  return res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [response],
    message: admissionApplicationVerifiedDocumentSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = { updateVerifiedDocuments };
