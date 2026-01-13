const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const SchoolAcademicClass = require("@MEModels/schoolAcademicClassModel");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { currentAcademicSession } = require("@MEUtils/utility");
const {
  USER_TYPES,
  HTTP_STATUS_CODES,
  ADMISSION_APPLICATION_STATUS,
} = require("@MEHelpers/enums");
const {
  admissionApplicationSummaryGetRequestSuccess,
  admissionApplicationsInvalidUserInformation,
  admissionApplicationsInvalidUserType,
} = require("@MEHelpers/responseMessage/admissionApplicationResponseMessage");

/**
 * @desc    Get admission application summary for school admin
 * @route   GET /school-admin/admission-applications/summary
 * @access  School Admin
 */
const getAdmissionApplicationSummary = asyncHandler(async (req, res, next) => {
  // Validate user type
  if (req.user.user_type !== USER_TYPES.SCHOOL_ADMIN) {
    return next(
      new ErrorResponse(
        admissionApplicationsInvalidUserType,
        HTTP_STATUS_CODES.STATUS_403
      )
    );
  }

  // Get school ID for current user
  const schoolId = await getSchoolIdForUser(req.user.id, next);

  if (!schoolId) return;

  // Get all school academic class IDs for this school
  const schoolAcademicClassIds = await getSchoolAcademicClassIds(schoolId);

  if (schoolAcademicClassIds.length === 0) {
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [getEmptySummaryData()],
      message: admissionApplicationSummaryGetRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }

  const currentAcademicYear = currentAcademicSession();

  // Fetch all aggregation data in parallel
  const [summaryStats, byAcademicClass, byMonth, byAcademicYear] =
    await Promise.all([
      getApplicationSummaryStats(schoolAcademicClassIds, currentAcademicYear),
      getAdmissionsByAcademicClass(schoolAcademicClassIds, currentAcademicYear),
      getAdmissionsByMonth(schoolAcademicClassIds, currentAcademicYear),
      getAdmissionsByAcademicYear(schoolAcademicClassIds),
    ]);

  // Build final response
  const summaryData = {
    admission_application: summaryStats.total,
    selected_application: summaryStats.selected,
    rejected_application: summaryStats.rejected,
    under_review_application: summaryStats.underReview,
    withdraw_application: summaryStats.withdrawn,
    admission_by_academic_class: byAcademicClass,
    admission_by_month: byMonth,
    admission_by_academic_year: byAcademicYear,
  };

  return res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [summaryData],
    message: admissionApplicationSummaryGetRequestSuccess,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

/**
 * Get school ID for the authenticated user
 */
const getSchoolIdForUser = async (userId, next) => {
  try {
    if (!userId) {
      next(
        new ErrorResponse(
          admissionApplicationsInvalidUserInformation,
          HTTP_STATUS_CODES.STATUS_403
        )
      );
      return null;
    }

    const schoolAddress = await User.findById(userId)
      .populate("school_address")
      .select("school_address");

    if (!schoolAddress?.school_address) {
      next(
        new ErrorResponse(
          admissionApplicationsInvalidUserInformation,
          HTTP_STATUS_CODES.STATUS_403
        )
      );
      return null;
    }

    return schoolAddress.school_address.school;
  } catch (error) {
    console.error("Error in getSchoolIdForUser:", error);
    next(error);
    return null;
  }
};

/**
 * Get all school academic class IDs for a school
 */
const getSchoolAcademicClassIds = async (schoolId) => {
  try {
    const schoolAcademicClasses = await SchoolAcademicClass.find({
      school: schoolId,
    }).select("_id");

    return schoolAcademicClasses.map(
      (schoolAcademicClass) => schoolAcademicClass._id
    );
  } catch (error) {
    return [];
  }
};

/**
 * Get application summary statistics (total, selected, rejected, etc.)
 */
const getApplicationSummaryStats = async (classIds, academicYear) => {
  try {
    const UNDER_REVIEW_STATUSES = [
      ADMISSION_APPLICATION_STATUS.UNDER_REVIEW,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
      ADMISSION_APPLICATION_STATUS.APPROVED,
      ADMISSION_APPLICATION_STATUS.FEES_PENDING,
      ADMISSION_APPLICATION_STATUS.FEES_PAID,
    ];

    const pipeline = [
      {
        $match: {
          school_academic_class: { $in: classIds },
          academic_session: academicYear,
        },
      },
      {
        $facet: {
          totalApplications: [{ $count: "count" }],
          selectedApplications: [
            { $match: { status: ADMISSION_APPLICATION_STATUS.SELECTED } },
            { $count: "count" },
          ],
          rejectedApplications: [
            { $match: { status: ADMISSION_APPLICATION_STATUS.REJECTED } },
            { $count: "count" },
          ],
          underReviewApplications: [
            { $match: { status: { $in: UNDER_REVIEW_STATUSES } } },
            { $count: "count" },
          ],
          withdrawnApplications: [
            { $match: { status: ADMISSION_APPLICATION_STATUS.WITHDRAWN } },
            { $count: "count" },
          ],
        },
      },
    ];

    const result = await AdmissionApplication.aggregate(pipeline);

    return {
      total: result[0].totalApplications[0]?.count || 0,
      selected: result[0].selectedApplications[0]?.count || 0,
      rejected: result[0].rejectedApplications[0]?.count || 0,
      underReview: result[0].underReviewApplications[0]?.count || 0,
      withdrawn: result[0].withdrawnApplications[0]?.count || 0,
    };
  } catch (error) {
    return {
      total: 0,
      selected: 0,
      rejected: 0,
      underReview: 0,
      withdrawn: 0,
    };
  }
};

/**
 * Get admissions grouped by academic class
 */
const getAdmissionsByAcademicClass = async (classIds, academicYear) => {
  try {
    const UNDER_REVIEW_STATUSES = [
      ADMISSION_APPLICATION_STATUS.UNDER_REVIEW,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
      ADMISSION_APPLICATION_STATUS.FEES_PENDING,
      ADMISSION_APPLICATION_STATUS.FEES_PAID,
    ];

    const pipeline = [
      {
        $match: {
          school_academic_class: { $in: classIds },
          academic_session: academicYear,
        },
      },
      {
        $group: {
          _id: "$school_academic_class",
          admission_application: { $sum: 1 },
          approved_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.APPROVED] },
                1,
                0,
              ],
            },
          },
          rejected_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.REJECTED] },
                1,
                0,
              ],
            },
          },
          withdrawn_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.WITHDRAWN] },
                1,
                0,
              ],
            },
          },
          under_review_application: {
            $sum: {
              $cond: [{ $in: ["$status", UNDER_REVIEW_STATUSES] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "school_academic_classes",
          localField: "_id",
          foreignField: "_id",
          as: "sac_details",
        },
      },
      { $unwind: "$sac_details" },
      {
        $lookup: {
          from: "academic_classes",
          localField: "sac_details.academic_class",
          foreignField: "_id",
          as: "academic_class_details",
        },
      },
      { $unwind: "$academic_class_details" },
      {
        $project: {
          academic_class: "$academic_class_details.academic_class",
          admission_application: { $ifNull: ["$admission_application", 0] },
          approved_application: { $ifNull: ["$approved_application", 0] },
          rejected_application: { $ifNull: ["$rejected_application", 0] },
          withdrawn_application: { $ifNull: ["$withdrawn_application", 0] },
          under_review_application: {
            $ifNull: ["$under_review_application", 0],
          },
          _id: 0,
        },
      },
      { $sort: { academic_class: 1 } },
    ];

    const result = await AdmissionApplication.aggregate(pipeline);
    return result || [];
  } catch (error) {
    console.error("Error in getAdmissionsByAcademicClass:", error);
    return [];
  }
};

/**
 * Get admissions grouped by month
 * Returns all 12 months with 0 for missing months
 */
const getAdmissionsByMonth = async (classIds, academicYear) => {
  try {
    const UNDER_REVIEW_STATUSES = [
      ADMISSION_APPLICATION_STATUS.UNDER_REVIEW,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
      ADMISSION_APPLICATION_STATUS.FEES_PENDING,
      ADMISSION_APPLICATION_STATUS.FEES_PAID,
    ];

    const pipeline = [
      {
        $match: {
          school_academic_class: { $in: classIds },
          academic_session: academicYear,
        },
      },
      {
        $group: {
          _id: { $month: "$created_at" },
          admission_application: { $sum: 1 },
          approved_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.APPROVED] },
                1,
                0,
              ],
            },
          },
          rejected_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.REJECTED] },
                1,
                0,
              ],
            },
          },
          withdrawn_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.WITHDRAWN] },
                1,
                0,
              ],
            },
          },
          under_review_application: {
            $sum: {
              $cond: [{ $in: ["$status", UNDER_REVIEW_STATUSES] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          admission_application: { $ifNull: ["$admission_application", 0] },
          approved_application: { $ifNull: ["$approved_application", 0] },
          rejected_application: { $ifNull: ["$rejected_application", 0] },
          withdrawn_application: { $ifNull: ["$withdrawn_application", 0] },
          under_review_application: {
            $ifNull: ["$under_review_application", 0],
          },
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ];

    const result = await AdmissionApplication.aggregate(pipeline);

    // Fill missing months with 0 to ensure all 12 months are present
    const monthMap = new Map(result.map((item) => [item.month, item]));
    const fullYear = [];

    for (let month = 1; month <= 12; month++) {
      fullYear.push(
        monthMap.has(month)
          ? monthMap.get(month)
          : {
              month,
              admission_application: 0,
              approved_application: 0,
              rejected_application: 0,
              withdrawn_application: 0,
              under_review_application: 0,
            }
      );
    }

    return fullYear;
  } catch (error) {
    console.error("Error in getAdmissionsByMonth:", error);
    return [];
  }
};

/**
 * Get admissions grouped by academic year with status breakdown
 * Includes current academic session and last 5 academic sessions
 */
const getAdmissionsByAcademicYear = async (classIds) => {
  try {
    // Get current academic session and last 5 sessions
    const currentSession = currentAcademicSession();
    const academicSessions = getPreviousAcademicSessions(currentSession, 5);

    const UNDER_REVIEW_STATUSES = [
      ADMISSION_APPLICATION_STATUS.UNDER_REVIEW,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFICATION_PENDING,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_VERIFIED,
      ADMISSION_APPLICATION_STATUS.DOCUMENTS_UNVERIFIED,
      ADMISSION_APPLICATION_STATUS.FEES_PENDING,
      ADMISSION_APPLICATION_STATUS.FEES_PAID,
    ];

    const pipeline = [
      {
        $match: {
          school_academic_class: { $in: classIds },
          academic_session: { $in: academicSessions },
        },
      },
      {
        $group: {
          _id: "$academic_session",
          admission_application: { $sum: 1 },
          approved_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.APPROVED] },
                1,
                0,
              ],
            },
          },
          rejected_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.REJECTED] },
                1,
                0,
              ],
            },
          },
          withdrawn_application: {
            $sum: {
              $cond: [
                { $eq: ["$status", ADMISSION_APPLICATION_STATUS.WITHDRAWN] },
                1,
                0,
              ],
            },
          },
          under_review_application: {
            $sum: {
              $cond: [{ $in: ["$status", UNDER_REVIEW_STATUSES] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          academic_year: "$_id",
          admission_application: { $ifNull: ["$admission_application", 0] },
          approved_application: { $ifNull: ["$approved_application", 0] },
          rejected_application: { $ifNull: ["$rejected_application", 0] },
          withdrawn_application: { $ifNull: ["$withdrawn_application", 0] },
          under_review_application: {
            $ifNull: ["$under_review_application", 0],
          },
          _id: 0,
        },
      },
      { $sort: { academic_year: -1 } },
    ];

    const result = await AdmissionApplication.aggregate(pipeline);

    // Fill missing academic sessions with 0 values
    const yearMap = new Map(result.map((item) => [item.academic_year, item]));
    const fullYears = [];

    for (const session of academicSessions) {
      fullYears.push(
        yearMap.has(session)
          ? yearMap.get(session)
          : {
              academic_year: session,
              admission_application: 0,
              approved_application: 0,
              rejected_application: 0,
              withdrawn_application: 0,
              under_review_application: 0,
            }
      );
    }

    return fullYears;
  } catch (error) {
    console.error("Error in getAdmissionsByAcademicYear:", error);
    return [];
  }
};

/**
 * Get current academic session and last N academic sessions
 * @param currentSession - Current academic session in format "2025-2026"
 * @param count - Number of past sessions to include
 * @returns Array of academic sessions including current
 */
const getPreviousAcademicSessions = (currentSession, count) => {
  try {
    if (!currentSession || typeof currentSession !== "string") {
      console.warn("Invalid currentSession parameter:", currentSession);
      return [];
    }

    const sessions = [currentSession];
    const yearParts = currentSession.split("-");
    const startYear = parseInt(yearParts[0], 10);

    if (isNaN(startYear)) {
      console.warn("Invalid academic session format:", currentSession);
      return sessions;
    }

    // Add last N sessions
    for (let i = 1; i <= count; i++) {
      const year = startYear - i;
      const nextYear = year + 1;
      sessions.push(`${year}-${nextYear}`);
    }

    return sessions;
  } catch (error) {
    console.error("Error in getPreviousAcademicSessions:", error);
    return [];
  }
};

/**
 * Get empty summary data structure (when no academic classes exist)
 */
const getEmptySummaryData = () => ({
  admission_application: 0,
  selected_application: 0,
  rejected_application: 0,
  under_review_application: 0,
  withdraw_application: 0,
  admission_by_academic_class: [],
  admission_by_month: [],
  admission_by_academic_year: [],
});

module.exports = { getAdmissionApplicationSummary };
