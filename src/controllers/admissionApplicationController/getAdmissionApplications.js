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
const { currentAcademicSession } = require("@MEUtils/utility");

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
        let currentSession = currentAcademicSession();

        query = {
          applicant_user: req.user.id,
        };

        const academicYearRegex = /^\d{4}-\d{4}$/;
        if (academicYearRegex.test(currentSession)) {
          query.academic_session = {
            $regex: `^${currentSession}`,
          };
        }

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
              HTTP_STATUS_CODES.STATUS_403,
            ),
          );
        }

        const schoolId = schoolAddress.school_address.school;

        let schoolAcademicClassIds = [];

        // Apply academic_class filter if provided
        if (req.query.academic_class) {
          schoolAcademicClassIds = [req.query.academic_class];
        } else {
          const schoolAcademicClasses = await SchoolAcademicClass.find({
            school: schoolId,
          }).select("_id");

          schoolAcademicClassIds = schoolAcademicClasses.map((sac) => sac._id);
        }

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
            HTTP_STATUS_CODES.STATUS_403,
          ),
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
            {
              path: "verified_documents",
              populate: [
                {
                  path: "school_admission_document",
                  populate: {
                    path: "admission_document",
                    select: ["_id", "admission_document"],
                  },
                  select: ["_id", "admission_document", "is_required"],
                },
              ],
            },
            {
              path: "document_verification_appointment",
              populate: {
                path: "booked_by",
                select: ["_id", "username", "first_name", "last_name"],
              },
            },
            {
              path: "fee_payment_appointment",
              populate: {
                path: "booked_by",
                select: ["_id", "username", "first_name", "last_name"],
              },
            }
          ])
          .sort({
            created_at: -1,
          });
        break;
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
            {
              path: "verified_documents",
              populate: [
                {
                  path: "school_admission_document",
                  populate: {
                    path: "admission_document",
                    select: ["_id", "admission_document"],
                  },
                  select: ["_id", "admission_document", "is_required"],
                },
              ],
            },
            {
              path: "document_verification_appointment",
              populate: {
                path: "booked_by",
                select: ["_id", "username", "first_name", "last_name"],
              },
            },
            {
              path: "fee_payment_appointment",
              populate: {
                path: "booked_by",
                select: ["_id", "username", "first_name", "last_name"],
              },
            }
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
          HTTP_STATUS_CODES.STATUS_404,
        ),
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
            ["desc"],
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
        HTTP_STATUS_CODES.STATUS_403,
      ),
    );
  }
});

module.exports = { getAdmissionApplications };
