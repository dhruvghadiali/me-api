const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const User = require("@MEModels/userModel");
const StudentProfile = require("@MEModels/studentProfileModel");
const ParentProfile = require("@MEModels/parentProfileModel");
const SiblingProfile = require("@MEModels/siblingProfileModel");
const EmergencyContact = require("@MEModels/emergencyContactModel");
const Address = require("@MEModels/addressModel");

const {
  HTTP_STATUS_CODES,
  USER_TYPES_FOR_ADDRESS,
} = require("@MEHelpers/enums");
const { PARENT_TYPES } = require("@MEHelpers/enums/studentEnums");
const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Get all user profile information
 * @route   GET /student/profile
 * @access  Student
 */
const getStudentProfileInfo = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Fetch user information
  let user = await User.findById(userId).select([
    "first_name",
    "last_name",
    "email",
    "phone_number",
  ]);

  if (user) {
    user = _.omit(user.toObject(), ["__v", "id", "_id"]);
  }

  // Fetch student profile
  const studentProfile = await StudentProfile.findOne({
    user: userId,
  }).populate([
    { path: "created_by", select: "username" },
    { path: "updated_by", select: "username" },
  ]);

  // Transform student profile to extract username strings
  let transformedStudentProfile = {};
  if (studentProfile) {
    const studentObj = studentProfile.toObject();
    transformedStudentProfile = {
      ...studentObj,
      created_by: studentObj.created_by?.username || studentObj.created_by,
      updated_by: studentObj.updated_by?.username || studentObj.updated_by,
    };
  }

  // Fetch parent profiles (father and mother)
  const parentProfiles = await ParentProfile.find({
    user: userId,
  }).populate([
    { path: "created_by", select: "username" },
    { path: "updated_by", select: "username" },
  ]);

  // Transform parent profiles to extract username strings
  const transformedParentProfiles = parentProfiles.map((profile) => {
    const obj = profile.toObject();
    return {
      ...obj,
      created_by: obj.created_by?.username || obj.created_by,
      updated_by: obj.updated_by?.username || obj.updated_by,
    };
  });

  // Separate father and mother profiles
  let fatherProfile =
    transformedParentProfiles.find(
      (p) => p.parent_type === PARENT_TYPES.FATHER
    ) || null;
  let motherProfile =
    transformedParentProfiles.find(
      (p) => p.parent_type === PARENT_TYPES.MOTHER
    ) || null;

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
    { path: "state", select: ["id", "name"] },
    { path: "district", select: ["id", "name"] },
    { path: "city", select: ["id", "name"] },
    { path: "area_name", select: ["id", "name"] },
    { path: "zipcode", select: ["id", "zipcode"] },
    { path: "created_by updated_by" },
  ]);

  // Process addresses based on user_type
  let studentAddress = {};
  let fatherAddress = {};
  let motherAddress = {};

  addresses.forEach((addr) => {
    if (addr.user_type === USER_TYPES_FOR_ADDRESS.STUDENT) {
      studentAddress = addr;
    } else if (addr.user_type === USER_TYPES_FOR_ADDRESS.FATHER) {
      fatherAddress = addr;
    } else if (addr.user_type === USER_TYPES_FOR_ADDRESS.MOTHER) {
      motherAddress = addr;
    }
  });

  // Attach addresses to respective profiles
  if (fatherProfile) {
    fatherProfile = { ...fatherProfile, address: fatherAddress };
  }

  if (motherProfile) {
    motherProfile = { ...motherProfile, address: motherAddress };
  }

  const responseData = {
    student: { ...transformedStudentProfile, ...(user || {}) } || {},
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
