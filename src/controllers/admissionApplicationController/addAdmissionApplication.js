const _ = require("lodash");
const moment = require("moment");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const {
  ADMISSION_APPLICATION_STATUS,
  HTTP_STATUS_CODES,
} = require("@MEHelpers/enums");
const {
  admissionApplicationPostRequestFail,
  admissionApplicationPostRequestSuccess,
} = require("@MEHelpers/responseMessage/admissionApplicationResponseMessage");

const { asyncHandler } = require("@MEMiddleware/async");
const { generateUniqueStringNumber } = require("@MEUtils/utility");

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
    return next(
      new ErrorResponse(
        admissionApplicationPostRequestFail,
        HTTP_STATUS_CODES.STATUS_400
      )
    );
  } else {
    // Send response
    return res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: [response],
      message: admissionApplicationPostRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  }
});

module.exports = { addAdmissionApplication };
