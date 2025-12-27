const Joi = require("joi");
const moment = require("moment");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES, GENDERS } = require("@ME/helpers/enums");
const {
  checkValidObjectId,
  isActiveAcademicClassExists,
} = require("@MEUtils/reqBodyValidator");
const {
  firstNameMinChar,
  firstNameMaxChar,
  lastNameMinChar,
  lastNameMaxChar,
  siblingProfileSchoolNameMinChar,
  siblingProfileSchoolNameMaxChar,
  siblingProfileAdmissionNumberMinChar,
  siblingProfileAdmissionNumberMaxChar,
  siblingProfileDateOfBirthMinAge,
  siblingProfileDateOfBirthMaxAge,
} = require("@MEHelpers/validationConst");
const {
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  firstNameBase,
  firstNameEmpty,
  lastNameRequired,
  lastNameMinLength,
  lastNameMaxLength,
  lastNameBase,
  lastNameEmpty,
  siblingProfileGenderRequired,
  siblingProfileGenderInvalid,
  genderBase,
  genderEmpty,
  genderInvalid,
  siblingProfileDateOfBirthRequired,
  siblingProfileDateOfBirthInvalid,
  dateOfBirthBase,
  dateOfBirthEmpty,
  dateOfBirthInvalid,
  dateOfBirthRequired,
  studyingInClassBase,
  studyingInClassEmpty,
  studyingInClassInvalid,
  siblingProfileSchoolNameMinLength,
  siblingProfileSchoolNameMaxLength,
  schoolNameBase,
  schoolNameEmpty,
  schoolNameRequired,
  schoolNameMinLength,
  schoolNameMaxLength,
  siblingProfileAdmissionNumberMinLength,
  siblingProfileAdmissionNumberMaxLength,
  siblingProfileAdmissionNumberInvalid,
  admissionNumberBase,
  admissionNumberMinLength,
  admissionNumberMaxLength,
  admissionNumberInvalid,
  reqBodyBase,
  reqBodyUnknown,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .required()
    .min(firstNameMinChar)
    .max(firstNameMaxChar)
    .messages({
      "string.base": firstNameBase,
      "string.empty": firstNameEmpty,
      "string.min": firstNameMinLength,
      "string.max": firstNameMaxLength,
      "any.required": firstNameRequired,
    }),
  last_name: Joi.string()
    .trim()
    .required()
    .min(lastNameMinChar)
    .max(lastNameMaxChar)
    .messages({
      "string.base": lastNameBase,
      "string.empty": lastNameEmpty,
      "string.min": lastNameMinLength,
      "string.max": lastNameMaxLength,
      "any.required": lastNameRequired,
    }),
  gender: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(GENDERS))
    .messages({
      "string.base": genderBase,
      "string.empty": genderEmpty,
      "any.only": genderInvalid,
      "any.required": siblingProfileGenderRequired,
    }),
  date_of_birth: Joi.date()
    .required()
    .custom((value, helpers) => {
      if (!value) return helpers.error("any.invalid");

      const today = moment().startOf("day");
      const birthDate = moment(value).startOf("day");
      const age = today.diff(birthDate, "years");

      if (
        age < siblingProfileDateOfBirthMinAge ||
        age > siblingProfileDateOfBirthMaxAge
      ) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({
      "date.base": dateOfBirthBase,
      "date.empty": dateOfBirthEmpty,
      "any.invalid": siblingProfileDateOfBirthInvalid,
      "any.required": siblingProfileDateOfBirthRequired,
    }),
  studying_in_class: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveAcademicClassExists)
    .messages({
      "string.base": studyingInClassBase,
      "string.empty": studyingInClassEmpty,
      "any.invalid": studyingInClassInvalid,
    }),
  same_school: Joi.boolean().optional().default(false),
  school_name: Joi.when("same_school", {
    is: false,
    then: Joi.string()
      .trim()
      .lowercase()
      .required()
      .min(siblingProfileSchoolNameMinChar)
      .max(siblingProfileSchoolNameMaxChar)
      .messages({
        "string.base": schoolNameBase,
        "string.empty": schoolNameEmpty,
        "string.min": schoolNameMinLength,
        "string.max": schoolNameMaxLength,
        "any.required": schoolNameRequired,
      }),
    otherwise: Joi.string().trim().lowercase().optional(),
  }),
  admission_number: Joi.string()
    .trim()
    .optional()
    .min(siblingProfileAdmissionNumberMinChar)
    .max(siblingProfileAdmissionNumberMaxChar)
    .pattern(/^[a-zA-Z0-9\-_/]+$/)
    .messages({
      "string.base": admissionNumberBase,
      "string.min": admissionNumberMinLength,
      "string.max": admissionNumberMaxLength,
      "string.pattern.base": admissionNumberInvalid,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": reqBodyBase,
    "object.empty": `Request body cannot be empty`,
    "object.unknown": reqBodyUnknown,
    "any.required": `Request body is required`,
  });

const validationPutSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .optional()
    .min(firstNameMinChar)
    .max(firstNameMaxChar)
    .messages({
      "string.base": firstNameBase,
      "string.empty": firstNameEmpty,
      "string.min": firstNameMinLength,
      "string.max": firstNameMaxLength,
    }),
  last_name: Joi.string()
    .trim()
    .optional()
    .min(lastNameMinChar)
    .max(lastNameMaxChar)
    .messages({
      "string.base": lastNameBase,
      "string.empty": lastNameEmpty,
      "string.min": lastNameMinLength,
      "string.max": lastNameMaxLength,
    }),
  gender: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .valid(...Object.values(GENDERS))
    .messages({
      "string.base": genderBase,
      "string.empty": genderEmpty,
      "any.only": genderInvalid,
    }),
  date_of_birth: Joi.date()
    .optional()
    .custom((value, helpers) => {
      if (!value) return value;

      const today = moment().startOf("day");
      const birthDate = moment(value).startOf("day");
      const age = today.diff(birthDate, "years");

      if (
        age < siblingProfileDateOfBirthMinAge ||
        age > siblingProfileDateOfBirthMaxAge
      ) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({
      "date.base": dateOfBirthBase,
      "date.empty": dateOfBirthEmpty,
      "any.invalid": siblingProfileDateOfBirthInvalid,
    }),
  studying_in_class: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveAcademicClassExists)
    .messages({
      "string.base": studyingInClassBase,
      "string.empty": studyingInClassEmpty,
      "any.invalid": studyingInClassInvalid,
    }),
  same_school: Joi.boolean().optional(),
  school_name: Joi.when("same_school", {
    is: false,
    then: Joi.string()
      .trim()
      .lowercase()
      .required()
      .min(siblingProfileSchoolNameMinChar)
      .max(siblingProfileSchoolNameMaxChar)
      .messages({
        "string.base": schoolNameBase,
        "string.empty": schoolNameEmpty,
        "string.min": schoolNameMinLength,
        "string.max": schoolNameMaxLength,
        "any.required": schoolNameRequired,
      }),
    otherwise: Joi.string().trim().lowercase().optional(),
  }),
  admission_number: Joi.string()
    .trim()
    .optional()
    .min(siblingProfileAdmissionNumberMinChar)
    .max(siblingProfileAdmissionNumberMaxChar)
    .pattern(/^[a-zA-Z0-9\-_/]+$/)
    .messages({
      "string.base": admissionNumberBase,
      "string.min": admissionNumberMinLength,
      "string.max": admissionNumberMaxLength,
      "string.pattern.base": admissionNumberInvalid,
    }),
});
const validateAddSiblingProfilePostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);
      next();
    } catch (error) {
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
  validateAddSiblingProfilePostReqBody,
};
