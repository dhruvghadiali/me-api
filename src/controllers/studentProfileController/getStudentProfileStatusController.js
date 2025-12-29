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
 * Helper function to calculate completion percentage
 * @param {Object} obj - Object to analyze
 * @param {Array} fieldsToCheck - Array of field names to check
 * @returns {Number} Percentage of fields filled
 */
const calculateCompletionPercentage = (obj, fieldsToCheck) => {
  if (!obj) return 0;

  const filledFields = fieldsToCheck.filter((field) => {
    const value = _.get(obj, field);
    // Check if field has a meaningful value
    return value !== null && value !== undefined && value !== "";
  });

  return Math.round((filledFields.length / fieldsToCheck.length) * 100);
};

/**
 * @desc    Get student profile completion status
 * @route   GET /student/profile/status
 * @access  Student
 */
const getStudentProfileStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Fetch user
  const user = await User.findById(userId);

  // Fetch student profile
  const studentProfile = await StudentProfile.findOne({
    user: userId,
  });

  // Fetch parent profiles (father and mother)
  const parentProfiles = await ParentProfile.find({
    user: userId,
  });

  const fatherProfile =
    parentProfiles.find((p) => p.parent_type === PARENT_TYPES.FATHER) || null;
  const motherProfile =
    parentProfiles.find((p) => p.parent_type === PARENT_TYPES.MOTHER) || null;

  // Fetch sibling profiles
  const siblingProfiles = await SiblingProfile.find({
    user: userId,
  });

  // Fetch emergency contacts
  const emergencyContacts = await EmergencyContact.find({
    user: userId,
  });

  // Fetch addresses
  const addresses = await Address.find({
    user: userId,
  });

  // Separate addresses by user_type
  let studentAddresses = addresses.filter((a) => a.user_type === "STUDENT");
  let fatherAddresses = addresses.filter((a) => a.user_type === "FATHER");
  let motherAddresses = addresses.filter((a) => a.user_type === "MOTHER");

  // Define fields to check for each model
  const userFields = ["first_name", "last_name", "email", "phone_number"];
  const studentProfileFields = [
    "date_of_birth",
    "gender",
    "blood_group",
    "aadhaar_number",
    "nationality",
    "medical_info",
  ];
  const parentProfileFields = [
    "first_name",
    "last_name",
    "phone_number",
    "email",
    "aadhaar_number",
    "occupation",
    "education",
    "annual_income",
    "caring_child_by",
  ];
  const siblingProfileFields = [
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
    "same_school",
    "studying_in_class",
  ];
  const emergencyContactFields = [
    "name",
    "relation",
    "phone_number",
    "alternate_phone",
    "email",
    "address",
  ];
  const addressFields = [
    "address",
    "state",
    "district",
    "city",
    "area_name",
    "zipcode",
  ];

  // Calculate completion percentages
  const studentStatus = calculateCompletionPercentage(user, userFields);
  const studentProfileStatus = calculateCompletionPercentage(
    studentProfile,
    studentProfileFields
  );
  const fatherStatus = calculateCompletionPercentage(
    fatherProfile,
    parentProfileFields
  );
  const motherStatus = calculateCompletionPercentage(
    motherProfile,
    parentProfileFields
  );

  // For siblings - calculate average if multiple siblings exist
  const siblingStatus =
    siblingProfiles.length > 0
      ? Math.round(
          siblingProfiles.reduce(
            (acc, sibling) =>
              acc +
              calculateCompletionPercentage(sibling, siblingProfileFields),
            0
          ) / siblingProfiles.length
        )
      : 0;

  // For emergency contacts - calculate average if multiple contacts exist
  const emergencyContactStatus =
    emergencyContacts.length > 0
      ? Math.round(
          emergencyContacts.reduce(
            (acc, contact) =>
              acc +
              calculateCompletionPercentage(contact, emergencyContactFields),
            0
          ) / emergencyContacts.length
        )
      : 0;

  // For addresses - use student address if exists, otherwise 0
  const addressStatus = calculateCompletionPercentage(
    studentAddresses.length > 0 ? studentAddresses[0] : null,
    addressFields
  );

  // Build response object
  const responseData = {
    student: studentProfileStatus,
    father: fatherStatus,
    mother: motherStatus,
    sibling: siblingStatus,
    address: addressStatus,
    emergency_contact: emergencyContactStatus,
  };

  // Send success response
  return res.status(HTTP_STATUS_CODES.STATUS_200).json({
    data: responseData,
    status: HTTP_STATUS_CODES.STATUS_200,
  });
});

module.exports = { getStudentProfileStatus };
