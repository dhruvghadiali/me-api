const mongoose = require("mongoose");
const _ = require("lodash");

const User = require("@MEModels/userModel");
const School = require("@MEModels/schoolModel");
const Organization = require("@MEModels/organizationModel");
const SchoolAddress = require("@MEModels/schoolAddressModel");
const OrganizationMember = require("@MEModels/organizationMemberModel");

const ErrorResponse = require("@MEUtils/errorResponse");
const {
  schoolDetailsRequired,
  schoolsGetRequestSuccess,
  schoolPostRequestSuccess,
  schoolAdminDetailsRequired,
  organizationDetailsRequired,
  schoolAddressDetailsRequired,
  organizationMemberDetailsRequired,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Get all schools
 * @route   GET /super-admin/schools
 * @access  Super Admin
 */
const getSchools = asyncHandler(async (req, res, next) => {
  // Find schools that are is_active status value is true and sort them by name
  const schools = await School.find({
    is_active: req.query.is_active || true,
  })
    .select(["-__v"])
    .populate([
      { path: "created_by updated_by" },
      {
        path: "education_boards",
        select: ["education_board"],
      },
      {
        path: "school_type",
        select: ["school_type"],
      },
      {
        path: "organization",
        populate: [
          { path: "created_by updated_by" },
          { path: "state", select: ["name"] },
          { path: "district", select: ["name"] },
          { path: "city", select: ["name"] },
          { path: "area_name", select: ["name"] },
          { path: "zipcode", select: ["zipcode"] },
          { path: "organization_member_count" },
          {
            path: "organization_members",
            populate: [
              { path: "created_by updated_by" },
              { path: "state", select: ["name"] },
              { path: "district", select: ["name"] },
              { path: "city", select: ["name"] },
              { path: "area_name", select: ["name"] },
              { path: "zipcode", select: ["zipcode"] },
            ],
          },
        ],
      },
    ])
    .populate([
      { path: "school_address_count" },
      {
        path: "school_address",
        populate: [
          { path: "created_by updated_by" },
          { path: "state", select: ["name"] },
          { path: "district", select: ["name"] },
          { path: "city", select: ["name"] },
          { path: "area_name", select: ["name"] },
          { path: "zipcode", select: ["zipcode"] },
          { path: "user" },
        ],
      },
    ])
    .sort({ name: 1 });

  // Send response
  res.status(200).json({
    data: schools,
    message: schoolsGetRequestSuccess,
  });
});

/**
 * @desc    Add school
 * @route   PATCH /super-admin/schools
 * @access  Super Admin
 */
const addSchool = asyncHandler(async (req, res, next) => {
  const hashedPassword = await User.setSchoolAdminDefaultPassword();
  const session = await mongoose.startSession();
  session.startTransaction();

  const { id } = req.user;
  let {
    organization,
    organization_members,
    school,
    school_admins,
    school_addresses,
  } = req.body;

  if (!organization) {
    return next(new ErrorResponse(organizationDetailsRequired, 400));
  } else if (!school) {
    return next(new ErrorResponse(schoolDetailsRequired, 400));
  } else if (!organization_members || organization_members.length <= 0) {
    return next(new ErrorResponse(organizationMemberDetailsRequired, 400));
  } else if (!school_admins || school_admins.length <= 0) {
    return next(new ErrorResponse(schoolAdminDetailsRequired, 400));
  } else if (!school_addresses || school_addresses.length <= 0) {
    return next(new ErrorResponse(schoolAddressDetailsRequired, 400));
  } else {
    try {
      // Create new organization with the user who signin.
      let organizationResponse = await Organization.create(
        [
          {
            ...organization,
            created_by: id,
            updated_by: id,
          },
        ],
        { session }
      );

      // Create new organization member with the user who signin.
      let organizationMembersResponse = await OrganizationMember.insertMany(
        organization_members.map((member) => {
          return {
            ...member,
            organization: organizationResponse[0].id,
            created_by: id,
            updated_by: id,
          };
        }),
        {
          session,
        }
      );

      // Create new school with the user who signin.
      let schoolResponse = await School.create(
        [
          {
            ...school,
            organization: organizationResponse[0].id,
            created_by: id,
            updated_by: id,
          },
        ],
        { session }
      );

      // Create new school admin.
      let usersResponse = await User.insertMany(
        school_admins.map((schoolAdmin) => {
          return {
            ...schoolAdmin,
            username: schoolAdmin.phone_number,
            password: hashedPassword,
            user_type: "SCHOOL_ADMIN",
            is_active: true,
            is_account_verified: true,
          };
        }),
        {
          session,
        }
      );

      // Create new school address with the user who signin.
      let schoolAddressesResponse = await SchoolAddress.insertMany(
        school_addresses.map((schoolAddress) => {
          return {
            ...schoolAddress,
            school: schoolResponse[0].id,
            user: _.find(
              usersResponse,
              (user) =>
                _.toString(user.phone_number) ===
                _.toString(schoolAddress.user_phone_number)
            )?.id,
            created_by: id,
            updated_by: id,
          };
        }),
        {
          session,
        }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        data: [],
        message: schoolPostRequestSuccess,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // Send error response
      throw error;
    }
  }
});

/**
 * @desc    Update school
 * @route   PATCH /super-admin/schools/:id
 * @access  Super Admin
 */
const updateSchool = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school id and update school details with user who signin
  const schoolInfo = await School.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  ).populate("created_by updated_by");

  if (schoolInfo) {
    // Send response
    res.status(200).json({
      data: [schoolInfo],
      message: "",
    });
  } else {
    // Send error response
    next(new ErrorResponse("", 400));
  }
});

// exports.deleteSchool = asyncHandler(async (req, res, next) => {
//  change is_active status for all school address and school admin.
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

// exports.restoreSchool = asyncHandler(async (req, res, next) => {
//  change is_active status for selected school address and school admin.
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

module.exports = {
  addSchool,
  getSchools,
  updateSchool,
};
