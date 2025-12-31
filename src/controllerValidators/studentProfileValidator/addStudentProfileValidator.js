const Joi = require("joi");
const moment = require("moment");

const ErrorResponse = require("@MEUtils/errorResponse");
const StudentProfile = require("@MEModels/studentProfileModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
const { emailRegex, phoneRegex } = require("@MEHelpers/regex");
const {
  GENDERS,
  BLOOD_GROUPS,
  HTTP_STATUS_CODES,
} = require("@ME/helpers/enums");
const {
  aadhaarNumberChar,
  studentProfileDateOfBirthMaxAge,
  studentProfileDateOfBirthMinAge,
  studentProfileNationalityMinChar,
  studentProfileNationalityMaxChar,
  studentProfileMedicalIssueDetailMinChar,
  studentProfileMedicalIssueDetailMaxChar,
  studentProfileMedicalAllergiesMinItems,
  studentProfileMedicalAllergiesMaxItems,
  firstNameMinChar,
  firstNameMaxChar,
  lastNameMinChar,
  lastNameMaxChar,
  emailMinChar,
  emailMaxChar,
  phoneNumberChar,
} = require("@MEHelpers/validationConst");
const {
  studentProfileDateOfBirthRequired,
  studentProfileDateOfBirthBase,
  studentProfileDateOfBirthEmpty,
  studentProfileInvalidDateOfBirth,
  studentProfileGenderRequired,
  studentProfileGenderBase,
  studentProfileGenderEmpty,
  studentProfileGenderInvalid,
  studentProfileBloodGroupRequired,
  studentProfileBloodGroupBase,
  studentProfileBloodGroupEmpty,
  studentProfileBloodGroupInvalid,
  studentProfileAadhaarNumberRequired,
  studentProfileAadhaarNumberBase,
  studentProfileAadhaarNumberEmpty,
  studentProfileAadhaarNumberMinLength,
  studentProfileNationalityRequired,
  studentProfileNationalityBase,
  studentProfileNationalityEmpty,
  studentProfileNationalityMinLength,
  studentProfileNationalityMaxLength,
  studentProfilePhotoUrlBase,
  studentProfileHasHearingIssueBase,
  hearingIssueDetailsMinLength,
  hearingIssueDetailsMaxLength,
  hearingIssueDetailsRequired,
  studentProfileHasVisionIssueBase,
  visionIssueDetailsMinLength,
  visionIssueDetailsMaxLength,
  visionIssueDetailsRequired,
  studentProfileHasPhysicalIssueBase,
  physicalIssueDetailsMinLength,
  physicalIssueDetailsMaxLength,
  physicalIssueDetailsRequired,
  studentProfileHasMentalIssueBase,
  mentalIssueDetailsMinLength,
  mentalIssueDetailsMaxLength,
  mentalIssueDetailsRequired,
  studentProfileHasAllergiesBase,
  studentProfileAllergiesBase,
  studentProfileAllergiesItemBase,
  allergiesMinItems,
  allergiesMaxItems,
  studentProfileReqBodyBase,
  studentProfileReqBodyEmpty,
  studentProfileReqBodyUnknown,
  studentProfileReqBodyRequired,
  studentProfileDuplicate,
  firstNameInvalidFormate,
  firstNameEmpty,
  firstNameMinLength,
  firstNameMaxLength,
  firstNameRequired,
  lastNameInvalidFormate,
  lastNameEmpty,
  lastNameMinLength,
  lastNameMaxLength,
  lastNameRequired,
  emailInvalidFormate,
  emailEmpty,
  emailInvalid,
  emailMinLength,
  emailMaxLength,
  emailRequired,
  phoneNumberInvalidFormate,
  phoneNumberEmpty,
  phoneNumberInvalid,
  phoneNumberMinLength,
  phoneNumberMaxLength,
  phoneNumberRequired,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(firstNameMinChar)
    .max(firstNameMaxChar)
    .required()
    .messages({
      "string.base": firstNameInvalidFormate,
      "string.empty": firstNameEmpty,
      "string.min": firstNameMinLength,
      "string.max": firstNameMaxLength,
      "any.required": firstNameRequired,
    }),
  last_name: Joi.string()
    .trim()
    .min(lastNameMinChar)
    .max(lastNameMaxChar)
    .required()
    .messages({
      "string.base": lastNameInvalidFormate,
      "string.empty": lastNameEmpty,
      "string.min": lastNameMinLength,
      "string.max": lastNameMaxLength,
      "any.required": lastNameRequired,
    }),
  email: Joi.string()
    .trim()
    .pattern(emailRegex)
    .min(emailMinChar)
    .max(emailMaxChar)
    .required()
    .messages({
      "string.base": emailInvalidFormate,
      "string.empty": emailEmpty,
      "string.pattern.base": emailInvalid,
      "string.min": emailMinLength,
      "string.max": emailMaxLength,
      "any.required": emailRequired,
    }),
  phone_number: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .min(phoneNumberChar)
    .max(phoneNumberChar)
    .required()
    .messages({
      "string.base": phoneNumberInvalidFormate,
      "string.empty": phoneNumberEmpty,
      "string.pattern.base": phoneNumberInvalid,
      "string.min": phoneNumberMinLength,
      "string.max": phoneNumberMaxLength,
      "any.required": phoneNumberRequired,
    }),
  date_of_birth: Joi.date()
    .required()
    .custom((value, helpers) => {
      if (!value) return helpers.error("any.invalid");

      const today = moment().startOf("day");
      const birthDate = moment(value).startOf("day");
      const minAge = moment().subtract(
        studentProfileDateOfBirthMaxAge,
        "years"
      );
      const maxAge = moment().subtract(
        studentProfileDateOfBirthMinAge,
        "years"
      );

      if (birthDate.isSameOrAfter(today)) {
        return helpers.error("any.invalid");
      }

      if (birthDate.isBefore(minAge) || birthDate.isAfter(maxAge)) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({
      "date.base": studentProfileDateOfBirthBase,
      "date.empty": studentProfileDateOfBirthEmpty,
      "any.invalid": studentProfileInvalidDateOfBirth,
      "any.required": studentProfileDateOfBirthRequired,
    }),
  gender: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(GENDERS))
    .messages({
      "string.base": studentProfileGenderBase,
      "string.empty": studentProfileGenderEmpty,
      "any.only": studentProfileGenderInvalid,
      "any.required": studentProfileGenderRequired,
    }),
  blood_group: Joi.string()
    .trim()
    .uppercase()
    .required()
    .valid(...Object.values(BLOOD_GROUPS))
    .messages({
      "string.base": studentProfileBloodGroupBase,
      "string.empty": studentProfileBloodGroupEmpty,
      "any.only": studentProfileBloodGroupInvalid,
      "any.required": studentProfileBloodGroupRequired,
    }),
  aadhaar_number: Joi.string()
    .trim()
    .lowercase()
    .required()
    .length(aadhaarNumberChar)
    .messages({
      "string.base": studentProfileAadhaarNumberBase,
      "string.empty": studentProfileAadhaarNumberEmpty,
      "string.length": studentProfileAadhaarNumberMinLength,
      "any.required": studentProfileAadhaarNumberRequired,
    }),
  nationality: Joi.string()
    .trim()
    .lowercase()
    .required()
    .min(studentProfileNationalityMinChar)
    .max(studentProfileNationalityMaxChar)
    .messages({
      "string.base": studentProfileNationalityBase,
      "string.empty": studentProfileNationalityEmpty,
      "string.min": studentProfileNationalityMinLength,
      "string.max": studentProfileNationalityMaxLength,
      "any.required": studentProfileNationalityRequired,
    }),
  photo_url: Joi.string().trim().optional().messages({
    "string.base": studentProfilePhotoUrlBase,
  }),
  medical_info: Joi.object({
    has_hearing_issue: Joi.boolean().default(false).messages({
      "boolean.base": studentProfileHasHearingIssueBase,
    }),
    hearing_issue_details: Joi.when("has_hearing_issue", {
      is: true,
      then: Joi.string()
        .trim()
        .required()
        .min(studentProfileMedicalIssueDetailMinChar)
        .max(studentProfileMedicalIssueDetailMaxChar)
        .messages({
          "string.min": hearingIssueDetailsMinLength,
          "string.max": hearingIssueDetailsMaxLength,
          "any.required": hearingIssueDetailsRequired,
        }),
      otherwise: Joi.string().trim().optional(),
    }),
    has_vision_issue: Joi.boolean().default(false).messages({
      "boolean.base": studentProfileHasVisionIssueBase,
    }),
    vision_issue_details: Joi.when("has_vision_issue", {
      is: true,
      then: Joi.string()
        .trim()
        .required()
        .min(studentProfileMedicalIssueDetailMinChar)
        .max(studentProfileMedicalIssueDetailMaxChar)
        .messages({
          "string.min": visionIssueDetailsMinLength,
          "string.max": visionIssueDetailsMaxLength,
          "any.required": visionIssueDetailsRequired,
        }),
      otherwise: Joi.string().trim().optional(),
    }),
    has_physical_issue: Joi.boolean().default(false).messages({
      "boolean.base": studentProfileHasPhysicalIssueBase,
    }),
    physical_issue_details: Joi.when("has_physical_issue", {
      is: true,
      then: Joi.string()
        .trim()
        .required()
        .min(studentProfileMedicalIssueDetailMinChar)
        .max(studentProfileMedicalIssueDetailMaxChar)
        .messages({
          "string.min": physicalIssueDetailsMinLength,
          "string.max": physicalIssueDetailsMaxLength,
          "any.required": physicalIssueDetailsRequired,
        }),
      otherwise: Joi.string().trim().optional(),
    }),
    has_mental_issue: Joi.boolean().default(false).messages({
      "boolean.base": studentProfileHasMentalIssueBase,
    }),
    mental_issue_details: Joi.when("has_mental_issue", {
      is: true,
      then: Joi.string()
        .trim()
        .required()
        .min(studentProfileMedicalIssueDetailMinChar)
        .max(studentProfileMedicalIssueDetailMaxChar)
        .messages({
          "string.min": mentalIssueDetailsMinLength,
          "string.max": mentalIssueDetailsMaxLength,
          "any.required": mentalIssueDetailsRequired,
        }),
      otherwise: Joi.string().trim().optional(),
    }),
    has_allergies: Joi.boolean().default(false).messages({
      "boolean.base": studentProfileHasAllergiesBase,
    }),
    allergies: Joi.when("has_allergies", {
      is: true,
      then: Joi.array()
        .items(Joi.string().trim())
        .min(studentProfileMedicalAllergiesMinItems)
        .max(studentProfileMedicalAllergiesMaxItems)
        .required()
        .messages({
          "array.base": studentProfileAllergiesBase,
          "array.min": allergiesMinItems,
          "array.max": allergiesMaxItems,
          "string.base": studentProfileAllergiesItemBase,
          "any.required": allergiesMinItems,
        }),
      otherwise: Joi.array().default([]),
    }),
  }).default({}),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": studentProfileReqBodyBase,
    "object.empty": studentProfileReqBodyEmpty,
    "object.unknown": studentProfileReqBodyUnknown,
    "any.required": studentProfileReqBodyRequired,
  });

const validateAddStudentProfilePostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      // Validate request body schema
      await validationPostSchema.validateAsync(req.body);

      // Check for duplicate student profile for the same user
      if (req.user && req.user.id) {
        const existingProfile = await StudentProfile.findOne({
          user: req.user.id,
        });

        if (existingProfile) {
          return next(
            new ErrorResponse(
              studentProfileDuplicate,
              HTTP_STATUS_CODES.STATUS_400
            )
          );
        }
      }

      // If validation passes, move to next middleware
      next();
    } catch (error) {
      // Handle validation errors
      next(
        new ErrorResponse(
          setValidationMessage(error),
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }
  }
);

module.exports = {
  validateAddStudentProfilePostReqBody,
};
