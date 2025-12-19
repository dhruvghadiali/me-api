const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");

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
 * @desc    Add payment method and mark fees as paid
 * @route   PUT /school-admin/admission-applications/:id/add-payment-method
 * @access  School Admin
 */
const addPaymentMethod = asyncHandler(async (req, res, next) => {
  const { payment_method, remarks } = req.body;
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

  // Check if application status is FEES_PENDING
  if (application.status !== ADMISSION_APPLICATION_STATUS.FEES_PENDING) {
    return next(
      new ErrorResponse(
        `Cannot add payment method. Application status must be ${ADMISSION_APPLICATION_STATUS.FEES_PENDING}`,
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

  // Update payment_method
  application.payment_method = payment_method;

  // Update status to FEES_PAID
  const previousStatus = application.status;
  application.status = ADMISSION_APPLICATION_STATUS.FEES_PAID;

  // Add to status history
  application.status_history.push({
    status: ADMISSION_APPLICATION_STATUS.FEES_PAID,
    changed_by: req.user._id,
    changed_at: new Date(),
    remarks:
      remarks ||
      `Status changed from ${previousStatus} to ${ADMISSION_APPLICATION_STATUS.FEES_PAID} - Payment method: ${payment_method}`,
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

  // Populate the response with fee payment details
  await response.populate([
    {
      path: "fee_payments.fee_type",
      select: "fee_type",
    },
  ]);

  // Send success response
  res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [response],
    message: admissionApplicationPutRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = { addPaymentMethod };
