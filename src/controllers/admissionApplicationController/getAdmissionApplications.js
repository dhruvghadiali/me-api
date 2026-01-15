const _ = require("lodash");
const moment = require("moment");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
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
    let admissionApplications = [];

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
      // School Admin - get applications for their school only
      case USER_TYPES.SCHOOL_ADMIN:
        // Get school ID from school_address
        const schoolAddress = await User.findById(req.user.id)
          .populate("school_address")
          .select("school_address");

        if (!schoolAddress || !schoolAddress.school_address) {
          return next(
            new ErrorResponse(
              admissionApplicationsInvalidUserInformation,
              HTTP_STATUS_CODES.STATUS_403
            )
          );
        }

        const schoolId = schoolAddress.school_address.school;

        // Get all school academic classes for this school
        let schoolAcademicClassesQuery = {
          school: schoolId,
        };

        // Apply academic_class filter if provided
        if (req.query.academic_class) {
          schoolAcademicClassesQuery.academic_class = req.query.academic_class;
        }

        const schoolAcademicClasses = await SchoolAcademicClass.find(
          schoolAcademicClassesQuery
        ).select("_id");

        const schoolAcademicClassIds = schoolAcademicClasses.map(
          (sac) => sac._id
        );

        // Filter applications by school academic classes
        query = {
          school_academic_class: { $in: schoolAcademicClassIds },
        };

        // Apply academic_year filter if provided
        // Validate format: YYYY-YYYY (e.g., 2025-2026)
        if (req.query.academic_year) {
          const academicYearRegex = /^\d{4}-\d{4}$/;
          if (academicYearRegex.test(req.query.academic_year)) {
            query.academic_session = {
              $regex: `^${req.query.academic_year}`,
            };
          }
        }

        // Apply status filter if provided
        if (req.query.status) {
          query.status = req.query.status;
        }
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

    switch (req.user.user_type) {
      case USER_TYPES.STUDENT:
        // Query admission applications
        admissionApplications = await AdmissionApplication.find(query)
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
      case USER_TYPES.SCHOOL_ADMIN:
        admissionApplications = await AdmissionApplication.find(query)
          .populate("created_by updated_by")
          .populate([
            {
              path: "school_academic_class",
              select: ["_id", "education_board", "academic_class", "school"],
              populate: [
                { path: "academic_class", select: ["academic_class", "_id"] },
                { path: "education_board", select: ["education_board", "_id"] },
              ],
            },
            {
              path: "status_history.changed_by",
              select: ["_id", "username", "first_name", "last_name"],
            },
          ])
          .populate([
            {
              path: "applicant_user",
              select: [
                "_id",
                "username",
                "first_name",
                "last_name",
                "email",
                "phone_number",
              ],
              populate: [
                { path: "student_profile" },
                { path: "parent_profile" },
                { path: "sibling_profile" },
                { path: "address" },
                { path: "emergency_contact" },
              ],
            },
          ]);
        break;
      default:
        break;
    }

    if (!admissionApplications) {
      // No applications found
      return next(
        new ErrorResponse(
          admissionApplicationsGetRequestFail,
          HTTP_STATUS_CODES.STATUS_404
        )
      );
    } else {
      // Sort status_history by changed_at in descending order (latest first) using lodash
      admissionApplications.forEach((application) => {
        if (
          application.status_history &&
          Array.isArray(application.status_history)
        ) {
          application.status_history = _.orderBy(
            application.status_history,
            ["changed_at"],
            ["desc"]
          );
        }
      });

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
