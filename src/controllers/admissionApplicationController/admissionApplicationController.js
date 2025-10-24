const _ = require("lodash");
const moment = require("moment");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");

const {
  ADMISSION_APPLICATION_STATUS,
} = require("@ME/helpers/enums/admissionEnums");
const {
  admissionApplicationPostRequestFail,
  admissionApplicationPostRequestSuccess,
  admissionApplicationNotFound,
  admissionApplicationNotAuthorizedToChangeStatus,
  admissionApplicationPutRequestFail,
  admissionApplicationPutRequestSuccess,
} = require("@MEHelpers/responseMessage");
const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES, USER_TYPES } = require("@ME/helpers/enums");
const { generateUniqueStringNumber } = require("@MEUtils/utility");
const { validateDocumentNotesRequired } = require("@MEUtils/dbQuery");

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
 *        UNDER_REVIEW -> DOCUMENTS_VERIFICATION_PENDING
 *        DOCUMENTS_VERIFICATION_PENDING -> DOCUMENTS_VERIFIED | DOCUMENTS_UNVERIFIED
 *        DOCUMENTS_VERIFIED -> APPROVED | REJECTED
 *        APPROVED -> FEES_PENDING | REJECTED
 *        FEES_PENDING -> FEES_PAID | REJECTED
 *        FEES_PAID -> SELECTED | REJECTED
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
  [ADMISSION_APPLICATION_STATUS.UNDER_REVIEW]: [
    ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
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
    ADMISSION_APPLICATION_STATUS.FEES_PENDING,
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
  [ADMISSION_APPLICATION_STATUS.FEES_PENDING]: [
    ADMISSION_APPLICATION_STATUS.FEES_PAID,
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
  [ADMISSION_APPLICATION_STATUS.FEES_PAID]: [
    ADMISSION_APPLICATION_STATUS.SELECTED,
    ADMISSION_APPLICATION_STATUS.REJECTED,
  ],
};

/**
 * @desc    Create new admission application
 * @route   POST /student/admission-applications
 * @access  Student
 */
const addAdmissionApplication = asyncHandler(async (req, res, next) => {
  const { school_academic_class, status } = req.body;
  const { id } = req.user;

  let remarks;

  if (status && _.toLower(status) === ADMISSION_APPLICATION_STATUS.DRAFT) {
    remarks = `Application created on ${ADMISSION_APPLICATION_STATUS.DRAFT} mode`;
  } else {
    status = ADMISSION_APPLICATION_STATUS.SUBMITTED;
    remarks = `Application created on ${ADMISSION_APPLICATION_STATUS.SUBMITTED} mode`;
  }

  const changed_by = id;
  const applicant_user = id;
  const created_by = id;
  const updated_by = id;
  const changed_at = new Date();
  const application_number = generateUniqueStringNumber({ prefix: "ADM" });
  const academic_session = `${moment().format("YYYY")}-${moment()
    .add(1, "year")
    .format("YYYY")}`;

  const applicationData = {
    school_academic_class,
    applicant_user,
    academic_session,
    application_number,
    status,
    status_history: [
      {
        status,
        changed_by,
        changed_at,
        remarks,
      },
    ],
    created_by,
    updated_by,
  };

  const response = await AdmissionApplication.create(applicationData);

  if (!response) {
    // Send error response
    next(
      new ErrorResponse(
        admissionApplicationPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    // Send response
    res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: [response],
      message: admissionApplicationPostRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  }
});

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
    res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [response],
      message: admissionApplicationPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
);
/**
 * @desc    Get single admission application
 * @route   GET /api/v1/admission-applications/:id
 * @access  Private (Student/School Admin)
 */
// exports.getAdmissionApplication = async (req, res, next) => {
//   try {
//     const application = await AdmissionApplication.findById(req.params.id)
//       .populate("school_academic_class")
//       .populate("applicant_user", "first_name last_name email phone_number")
//       .populate("verified_documents.school_admission_document")
//       .populate("fee_payments.fee_type")
//       .populate("created_by", "first_name last_name")
//       .populate("updated_by", "first_name last_name");

//     if (!application) {
//       return next(
//         new ErrorResponse(
//           "Admission application not found",
//           HTTP_STATUS_CODES.NOT_FOUND
//         )
//       );
//     }

//     res.status(HTTP_STATUS_CODES.OK).json({
//       success: true,
//       data: application,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Get all admission applications (with filters)
 * @route   GET /api/v1/admission-applications
 * @access  Private (Student/School Admin)
 */
// exports.getAdmissionApplications = async (req, res, next) => {
//   try {
//     const { status, academic_session, school_academic_class } = req.query;

//     const filter = {};

//     // If student, only show their applications
//     if (req.user.user_type === "student") {
//       filter.applicant_user = req.user._id;
//     }

//     if (status) filter.status = status;
//     if (academic_session) filter.academic_session = academic_session;
//     if (school_academic_class)
//       filter.school_academic_class = school_academic_class;

//     const applications = await AdmissionApplication.find(filter)
//       .populate("school_academic_class")
//       .populate("applicant_user", "first_name last_name email phone_number")
//       .sort({ created_at: -1 });

//     res.status(HTTP_STATUS_CODES.OK).json({
//       success: true,
//       count: applications.length,
//       data: applications,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Book document verification appointment
 * @route   PUT /api/v1/admission-applications/:id/book-document-verification
 * @access  Private (Student/School Admin)
 */
// exports.bookDocumentVerificationAppointment = async (req, res, next) => {
//   try {
//     const { scheduled_date, scheduled_time_slot, location, remarks } = req.body;

//     const application = await AdmissionApplication.findById(req.params.id);

//     if (!application) {
//       return next(
//         new ErrorResponse(
//           "Admission application not found",
//           HTTP_STATUS_CODES.NOT_FOUND
//         )
//       );
//     }

//     // Check if application is in appropriate status
//     if (
//       application.status !==
//         ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING &&
//       application.status !== ADMISSION_APPLICATION_STATUS.UNDER_REVIEW
//     ) {
//       return next(
//         new ErrorResponse(
//           "Cannot book document verification appointment for current status",
//           HTTP_STATUS_CODES.BAD_REQUEST
//         )
//       );
//     }

//     application.document_verification_appointment.push({
//       scheduled_date,
//       scheduled_time_slot,
//       location,
//       booked_at: new Date(),
//       booked_by: req.user._id,
//       status: ADMISSION_APPLICATION_STATUS.CONFIRMED,
//       remarks,
//     });
//     application.updated_by = req.user._id;

//     await application.save();

//     res.status(HTTP_STATUS_CODES.OK).json({
//       success: true,
//       data: application,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Book fee payment appointment
 * @route   PUT /api/v1/admission-applications/:id/book-fee-payment
 * @access  Private (Student/School Admin)
 */
// exports.bookFeePaymentAppointment = async (req, res, next) => {
//   try {
//     const { scheduled_date, scheduled_time_slot, location, remarks } = req.body;

//     const application = await AdmissionApplication.findById(req.params.id);

//     if (!application) {
//       return next(
//         new ErrorResponse(
//           "Admission application not found",
//           HTTP_STATUS_CODES.NOT_FOUND
//         )
//       );
//     }

//     // Check if application is in appropriate status
//     if (
//       application.status !== ADMISSION_APPLICATION_STATUS.FEES_PENDING &&
//       application.status !== ADMISSION_APPLICATION_STATUS.APPROVED
//     ) {
//       return next(
//         new ErrorResponse(
//           "Cannot book fee payment appointment for current status",
//           HTTP_STATUS_CODES.BAD_REQUEST
//         )
//       );
//     }

//     application.fee_payment_appointment.push({
//       scheduled_date,
//       scheduled_time_slot,
//       location,
//       booked_at: new Date(),
//       booked_by: req.user._id,
//       status: ADMISSION_APPLICATION_STATUS.CONFIRMED,
//       remarks,
//     });
//     application.updated_by = req.user._id;

//     await application.save();

//     res.status(HTTP_STATUS_CODES.OK).json({
//       success: true,
//       data: application,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Update document verification details
 * @route   PUT /api/v1/admission-applications/:id/verify-documents
 * @access  Private (School Admin)
 */
// exports.updateDocumentVerification = async (req, res, next) => {
//   try {
//     const { verified_documents } = req.body;

//     const application = await AdmissionApplication.findById(req.params.id);

//     if (!application) {
//       return next(
//         new ErrorResponse(
//           "Admission application not found",
//           HTTP_STATUS_CODES.NOT_FOUND
//         )
//       );
//     }

//     // Validate that required documents that are not verified have notes
//     for (const verifiedDoc of verified_documents) {
//       const isValid = await validateDocumentNotesRequired(
//         verifiedDoc.notes,
//         verifiedDoc.is_verified,
//         verifiedDoc.school_admission_document
//       );

//       if (!isValid) {
//         return next(
//           new ErrorResponse(
//             `Notes are required for unverified required document: ${verifiedDoc.school_admission_document}`,
//             HTTP_STATUS_CODES.BAD_REQUEST
//           )
//         );
//       }
//     }

//     application.verified_documents = verified_documents;
//     application.updated_by = req.user._id;

//     await application.save();

//     res.status(HTTP_STATUS_CODES.OK).json({
//       success: true,
//       data: application,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Add fee payment record
 * @route   PUT /api/v1/admission-applications/:id/add-fee-payment
 * @access  Private (School Admin)
 */
// exports.addFeePayment = async (req, res, next) => {
//   try {
//     const { fee_type, amount, txn_id, payment_method } = req.body;

//     const application = await AdmissionApplication.findById(req.params.id);

//     if (!application) {
//       return next(
//         new ErrorResponse(
//           "Admission application not found",
//           HTTP_STATUS_CODES.NOT_FOUND
//         )
//       );
//     }

//     application.fee_payments.push({
//       fee_type,
//       amount,
//       paid_at: new Date(),
//       txn_id,
//     });

//     if (payment_method) {
//       application.payment_method = payment_method;
//     }

//     application.updated_by = req.user._id;

//     await application.save();

//     res.status(HTTP_STATUS_CODES.OK).json({
//       success: true,
//       data: application,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  addAdmissionApplication,
  updateAdmissionApplicationStatus,
};
