const mongoose = require("mongoose");

const User = require("@MEModels/userModel");
const School = require("@MEModels/schoolModel");
const Organization = require("@MEModels/organizationModel");
const SchoolAddress = require("@MEModels/schoolAddressModel");
const OrganizationMember = require("@MEModels/organizationMemberModel");

const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Add school
 * @route   PATCH /super-admin/schools
 * @access  Super Admin
 */
const addSchool = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { id } = req.user;
  let { organization, organization_members } = req.body;

  console.log("organization req.body", organization);
  console.log("organization_members req.body", organization_members);

  try {
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

    console.log("organizationResponse", organizationResponse);

    organization_members = organization_members.map((member) => {
      return {
        ...member,
        organization: organizationResponse[0].id,
        created_by: id,
        updated_by: id,
      };
    });

    console.log("organization_members req.body", organization_members);

    let organizationMembersResponse = await OrganizationMember.insertMany(
      [...organization_members],
      {
        session,
      }
    );

    console.log("organizationMembersResponse", organizationMembersResponse);

    // Create school
    // Create school admin
    // create school address

    let response = await session.commitTransaction();
    session.endSession();

    console.log("response", response);

    res.status(200).json({
      data: [],
      message: "School detail insert successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Send error response
    throw error;
  }
});

// exports.getActiveSchoolAddressSchools = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

// exports.getSchools = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

// exports.getSchool = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

// exports.updateSchool = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

// exports.restoreSchool = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

// exports.deleteSchool = asyncHandler(async (req, res, next) => {
//   res.status(200).json({
//     data: [],
//     message: "School detail get successfully",
//   });
// });

module.exports = {
  addSchool,
};
