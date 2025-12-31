const Joi = require("joi");
const moment = require("moment");

const ErrorResponse = require("@MEUtils/errorResponse");

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
  studentProfileDateOfBirthBase,
  studentProfileDateOfBirthEmpty,
  studentProfileInvalidDateOfBirth,
  studentProfileGenderBase,
  studentProfileGenderEmpty,
  studentProfileGenderInvalid,
  studentProfileBloodGroupBase,
  studentProfileBloodGroupEmpty,
  studentProfileBloodGroupInvalid,
  studentProfileAadhaarNumberBase,
  studentProfileAadhaarNumberEmpty,
  studentProfileAadhaarNumberMinLength,
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
  firstNameInvalidFormate,
  firstNameEmpty,
  firstNameMinLength,
  firstNameMaxLength,
  lastNameInvalidFormate,
  lastNameEmpty,
  lastNameMinLength,
  lastNameMaxLength,
  emailInvalidFormate,
  emailEmpty,
  emailInvalid,
  emailMinLength,
  emailMaxLength,
  phoneNumberInvalidFormate,
  phoneNumberEmpty,
  phoneNumberInvalid,
  phoneNumberMinLength,
  phoneNumberMaxLength,
} = require("@MEHelpers/validationMessage");

const validationPutSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(firstNameMinChar)
    .max(firstNameMaxChar)
    .messages({
      "string.base": firstNameInvalidFormate,
      "string.empty": firstNameEmpty,
      "string.min": firstNameMinLength,
      "string.max": firstNameMaxLength,
    }),
  last_name: Joi.string()
    .trim()
    .min(lastNameMinChar)
    .max(lastNameMaxChar)
    .messages({
      "string.base": lastNameInvalidFormate,
      "string.empty": lastNameEmpty,
      "string.min": lastNameMinLength,
      "string.max": lastNameMaxLength,
    }),
  email: Joi.string()
    .trim()
    .pattern(emailRegex)
    .min(emailMinChar)
    .max(emailMaxChar)
    .messages({
      "string.base": emailInvalidFormate,
      "string.empty": emailEmpty,
      "string.pattern.base": emailInvalid,
      "string.min": emailMinLength,
      "string.max": emailMaxLength,
    }),
  phone_number: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .min(phoneNumberChar)
    .max(phoneNumberChar)
    .messages({
      "string.base": phoneNumberInvalidFormate,
      "string.empty": phoneNumberEmpty,
      "string.pattern.base": phoneNumberInvalid,
      "string.min": phoneNumberMinLength,
      "string.max": phoneNumberMaxLength,
    }),
  date_of_birth: Joi.date()
    .optional()
    .custom((value, helpers) => {
      if (!value) return value;

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
    }),
  gender: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .valid(...Object.values(GENDERS))
    .messages({
      "string.base": studentProfileGenderBase,
      "string.empty": studentProfileGenderEmpty,
      "any.only": studentProfileGenderInvalid,
    }),
  blood_group: Joi.string()
    .trim()
    .uppercase()
    .optional()
    .valid(...Object.values(BLOOD_GROUPS))
    .messages({
      "string.base": studentProfileBloodGroupBase,
      "string.empty": studentProfileBloodGroupEmpty,
      "any.only": studentProfileBloodGroupInvalid,
    }),
  aadhaar_number: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .length(aadhaarNumberChar)
    .messages({
      "string.base": studentProfileAadhaarNumberBase,
      "string.empty": studentProfileAadhaarNumberEmpty,
      "string.length": studentProfileAadhaarNumberMinLength,
    }),
  nationality: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .min(studentProfileNationalityMinChar)
    .max(studentProfileNationalityMaxChar)
    .messages({
      "string.base": studentProfileNationalityBase,
      "string.empty": studentProfileNationalityEmpty,
      "string.min": studentProfileNationalityMinLength,
      "string.max": studentProfileNationalityMaxLength,
    }),
  photo_url: Joi.string().trim().optional().messages({
    "string.base": studentProfilePhotoUrlBase,
  }),
  medical_info: Joi.object({
    has_hearing_issue: Joi.boolean().optional().messages({
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
    has_vision_issue: Joi.boolean().optional().messages({
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
    has_physical_issue: Joi.boolean().optional().messages({
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
    has_mental_issue: Joi.boolean().optional().messages({
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
    has_allergies: Joi.boolean().optional().messages({
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
      otherwise: Joi.array().optional(),
    }),
  }).optional(),
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

const validateUpdateStudentProfilePutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      // Validate request body schema
      await validationPutSchema.validateAsync(req.body);

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
  validateUpdateStudentProfilePutReqBody,
};
