const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const User = require("@MEModels/userModel");
const StudentProfile = require("@MEModels/studentProfileModel");
const ParentProfile = require("@MEModels/parentProfileModel");
const SiblingProfile = require("@MEModels/siblingProfileModel");
const EmergencyContact = require("@MEModels/emergencyContactModel");
const Address = require("@MEModels/addressModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const { PARENT_TYPES } = require("@MEHelpers/enums/studentEnums");
const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Get all user profile information
 * @route   GET /student/profile
 * @access  Student
 */
const getStudentProfileInfo = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Fetch student profile
  const studentProfile = await StudentProfile.findOne({
    user: userId,
  }).populate([{ path: "user" }]);

  // Fetch parent profiles (father and mother)
  const parentProfiles = await ParentProfile.find({
    user: userId,
  }).populate([{ path: "user" }]);

  // Separate father and mother profiles
  const fatherProfile =
    parentProfiles.find((p) => p.parent_type === PARENT_TYPES.FATHER) || null;
  const motherProfile =
    parentProfiles.find((p) => p.parent_type === PARENT_TYPES.MOTHER) || null;

  // Fetch sibling profiles
  const siblingProfiles = await SiblingProfile.find({
    user: userId,
  }).populate([{ path: "user" }, { path: "studying_in_class" }]);

  // Fetch emergency contacts
  const emergencyContacts = await EmergencyContact.find({
    user: userId,
  }).populate([{ path: "user" }]);

  // Fetch addresses
  const addresses = await Address.find({
    user: userId,
  }).populate([
    { path: "state" },
    { path: "district" },
    { path: "city" },
    { path: "area_name" },
    { path: "zipcode" },
  ]);

  // Process addresses based on user_type
  let studentAddress = {};
  let fatherAddress = {};
  let motherAddress = {};

  addresses.forEach((addr) => {
    if (addr.user_type === "STUDENT") {
      studentAddress = addr;
    } else if (addr.user_type === "FATHER") {
      fatherAddress = addr;
    } else if (addr.user_type === "MOTHER") {
      motherAddress = addr;
    }
  });

  // Attach addresses to respective profiles
  if (fatherProfile) {
    fatherProfile.address = fatherAddress;
  }

  if (motherProfile) {
    motherProfile.address = motherAddress;
  }

  // Build response object
  const responseData = {
    student: studentProfile || {},
    father: fatherProfile || {},
    mother: motherProfile || {},
    siblings: siblingProfiles || [],
    address: studentAddress || {},
    emergency_contacts: emergencyContacts || [],
  };

  // Send success response
  return res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: [responseData],
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = { getStudentProfileInfo };
