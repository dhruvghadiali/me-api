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
  firstNameMaxLength,
  firstNameMinLength,
  lastNameMinLength,
  lastNameMaxLength,
  firstNameBase,
  firstNameEmpty,
  firstNameRequired,
  lastNameBase,
  lastNameEmpty,
  lastNameRequired,
  genderBase,
  genderEmpty,
  genderRequired,
  genderInvalid,
  dateOfBirthBase,
  dateOfBirthEmpty,
  dateOfBirthRequired,
  dateOfBirthInvalid,
  studyingInClassBase,
  studyingInClassEmpty,
  studyingInClassRequired,
  studyingInClassInvalid,
  schoolNameBase,
  schoolNameEmpty,
  schoolNameRequired,
  schoolNameMinLength,
  schoolNameMaxLength,
  admissionNumberBase,
  admissionNumberMinLength,
  admissionNumberMaxLength,
  admissionNumberInvalid,
  siblingProfileGenderInvalid,
  siblingProfileDateOfBirthInvalid,
  siblingProfileSchoolNameMinLength,
  siblingProfileSchoolNameMaxLength,
  siblingProfileAdmissionNumberMinLength,
  siblingProfileAdmissionNumberMaxLength,
  siblingProfileAdmissionNumberInvalid,
  reqBodyBase,
  reqBodyUnknown,
} = require("@MEHelpers/validationMessage");

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
      "any.invalid": dateOfBirthInvalid,
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
})
  .unknown(false)
  .messages({
    "object.base": reqBodyBase,
    "object.unknown": reqBodyUnknown,
  });

const validateUpdateSiblingProfilePutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPutSchema.validateAsync(req.body);
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
  validateUpdateSiblingProfilePutReqBody,
};
