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
const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");

/**
 * @desc    Add fee payment appointment (only adds to array, no status change)
 * @route   POST /school-admin/admission-applications/:id/fee-payment-appointment
 * @access  School Admin
 */
const addFeePaymentAppointment = asyncHandler(async (req, res, next) => {
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

  // Add appointment to fee_payment_appointment array
  application.fee_payment_appointment.push({
    scheduled_date,
    scheduled_time_slot,
    booked_at: new Date(),
    booked_by: req.user._id,
    remarks: remarks || "Fee payment appointment added",
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

  // Populate the response with booked_by details
  await response.populate([
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

module.exports = { addFeePaymentAppointment };
