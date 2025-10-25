const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const SchoolFee = require("@MEModels/schoolFeeModel");

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
 * @desc    Book fee payment appointment
 * @route   PUT /school-admin/admission-applications/:id/book-fee-payment
 * @access  School Admin
 */
const bookFeePaymentAppointment = asyncHandler(async (req, res, next) => {
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

  // Check if application status is APPROVED
  if (
    _.toLower(_.toString(application.status)) !==
    _.toLower(_.toString(ADMISSION_APPLICATION_STATUS.APPROVED))
  ) {
    return next(
      new ErrorResponse(
        `Cannot book fee payment appointment. Application status must be ${ADMISSION_APPLICATION_STATUS.APPROVED}`,
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

  // Get all school fees for this school_academic_class
  const schoolFees = await SchoolFee.find({
    school_academic_class: application.school_academic_class,
    is_active: true,
  })
    .select("fee_type monthly_fee quarterly_fee half_yearly_fee yearly_fee")
    .populate("fee_type", "fee_type");

  if (!schoolFees || schoolFees.length === 0) {
    return next(
      new ErrorResponse(
        "No fee details found for this school academic class",
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  }

  // Initialize fee_payments with all fee types (if empty)
  if (!application.fee_payments || application.fee_payments.length === 0) {
    application.fee_payments = schoolFees.map((feeDetail) => ({
      fee_type: feeDetail.fee_type._id,
      amount: feeDetail.yearly_fee || 0, // Default to yearly fee
      paid_at: null,
      txn_id: "",
    }));
  }

  // Add appointment to fee_payment_appointment array
  application.fee_payment_appointment.push({
    scheduled_date,
    scheduled_time_slot,
    booked_at: new Date(),
    booked_by: req.user._id,
    remarks: remarks || "Fee payment appointment scheduled",
  });

  // Update status to FEES_PENDING
  const previousStatus = application.status;
  application.status = ADMISSION_APPLICATION_STATUS.FEES_PENDING;

  // Add to status history
  application.status_history.push({
    status: ADMISSION_APPLICATION_STATUS.FEES_PENDING,
    changed_by: req.user._id,
    changed_at: new Date(),
    remarks:
      remarks ||
      `Status changed from ${previousStatus} to ${ADMISSION_APPLICATION_STATUS.FEES_PENDING} - Fee payment appointment scheduled`,
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

  // Populate the response with fee and appointment details
  await response.populate([
    {
      path: "fee_payments.fee_type",
      select: "fee_type",
    },
    {
      path: "fee_payment_appointment.booked_by",
      select: "first_name last_name",
    },
  ]);

  // Send success response
  res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [response],
    message: admissionApplicationPutRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = { bookFeePaymentAppointment };
