const Joi = require("joi");
const moment = require("moment");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  GENDERS,
  BLOOD_GROUPS,
  HTTP_STATUS_CODES,
} = require("@ME/helpers/enums");
const {
  checkValidObjectId,
  isActiveUserExists,
} = require("@MEUtils/reqBodyValidator");
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
} = require("@MEHelpers/validationConst");
const {
  studentProfileUserBase,
  studentProfileUserEmpty,
  studentProfileUserInvalid,
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
} = require("@MEHelpers/validationMessage");

const validationPutSchema = Joi.object({
  user: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveUserExists)
    .messages({
      "string.base": studentProfileUserBase,
      "string.empty": studentProfileUserEmpty,
      "any.invalid": studentProfileUserInvalid,
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
