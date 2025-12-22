const moment = require("moment");
const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const {
  USER_TYPES,
  HTTP_STATUS_CODES,
  ADMISSION_APPLICATION,
} = require("@MEHelpers/enums");
const {
  admissionApplicationsGetRequestFail,
  admissionApplicationsInvalidUserType,
  admissionApplicationsGetRequestSuccess,
  admissionApplicationsInvalidUserInformation,
} = require("@MEHelpers/responseMessage/admissionApplicationResponseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Create new admission application
 * @route   GET /student/admission-applications
 * @access  Student
 */
const getAdmissionApplications = asyncHandler(async (req, res, next) => {
  if (req && req.user && req.user.user_type) {
    let query = {};
    switch (req.user.user_type) {
      // Student - get applications from last 2 years
      case USER_TYPES.STUDENT:
        // Calculate date range for last 2 years from current academic session
        const currentYear = moment().year();
        const currentMonth = moment().month();

        // Typically academic session starts in April/June, adjust as per your requirement
        const academicSessionStartMonth =
          ADMISSION_APPLICATION.ACADEMIC_SESSION_START_MONTH;
        const currentAcademicYear =
          currentMonth > academicSessionStartMonth
            ? currentYear
            : currentYear - 1;
        const academicYearEnd =
          currentAcademicYear -
          ADMISSION_APPLICATION.STUDENT_ACADEMIC_YEARS_RANGE;

        // Build regex pattern for valid academic session years (e.g., "2023-", "2024-", "2025-")
        const validYears = Array.from(
          { length: currentAcademicYear - academicYearEnd + 1 },
          (_, i) => academicYearEnd + i
        );
        const yearPattern = validYears.join("|");

        query = {
          applicant_user: req.user.id,
          academic_session: {
            $regex: `^(${yearPattern})-`,
          },
        };
        break;
      default:
        // Invalid user type
        return next(
          new ErrorResponse(
            admissionApplicationsInvalidUserType,
            HTTP_STATUS_CODES.STATUS_403
          )
        );
    }

    // Query admission applications
    const admissionApplications = await AdmissionApplication.find(query)
      .populate("created_by updated_by")
      .populate([
        {
          path: "school_academic_class",
          select: ["_id", "education_board", "academic_class", "school"],
          populate: [
            { path: "academic_class", select: ["academic_class", "_id"] },
            { path: "education_board", select: ["education_board", "_id"] },
            { path: "school", select: ["name", "_id"] },
          ],
        },
        {
          path: "status_history.changed_by",
          select: ["_id", "username", "first_name", "last_name"],
        },
      ])
      .sort({
        created_at: -1,
      });

    if (!admissionApplications) {
      // No applications found
      return next(
        new ErrorResponse(
          admissionApplicationsGetRequestFail,
          HTTP_STATUS_CODES.STATUS_404
        )
      );
    } else {
      // Send response
      return res.status(HTTP_STATUS_CODES.STATUS_200).json({
        data: admissionApplications,
        message: admissionApplicationsGetRequestSuccess,
        status: HTTP_STATUS_CODES.STATUS_200,
      });
    }
  } else {
    // Invalid user information
    return next(
      new ErrorResponse(
        admissionApplicationsInvalidUserInformation,
        HTTP_STATUS_CODES.STATUS_403
      )
    );
  }
});

module.exports = { getAdmissionApplications };
