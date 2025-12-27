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
  siblingProfileGenderBase,
  siblingProfileGenderEmpty,
  siblingProfileGenderInvalid,
  siblingProfileDateOfBirthRequired,
  siblingProfileDateOfBirthInvalid,
  siblingProfileDateOfBirthBase,
  siblingProfileDateOfBirthEmpty,
  siblingProfileStudyingInClassBase,
  siblingProfileStudyingInClassEmpty,
  siblingProfileStudyingInClassInvalid,
  siblingProfileSchoolNameBase,
  siblingProfileSchoolNameEmpty,
  siblingProfileSchoolNameRequired,
  siblingProfileSchoolNameMinLength,
  siblingProfileSchoolNameMaxLength,
  siblingProfileAdmissionNumberBase,
  siblingProfileAdmissionNumberMinLength,
  siblingProfileAdmissionNumberMaxLength,
  siblingProfileAdmissionNumberEmpty,
  siblingProfileAdmissionNumberRequired,
  siblingProfileReqBodyBase,
  siblingProfileReqBodyEmpty,
  siblingProfileReqBodyUnknown,
  siblingProfileReqBodyRequired,
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
      "string.base": siblingProfileGenderBase,
      "string.empty": siblingProfileGenderEmpty,
      "any.only": siblingProfileGenderInvalid,
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
      "date.base": siblingProfileDateOfBirthBase,
      "date.empty": siblingProfileDateOfBirthEmpty,
      "any.invalid": siblingProfileDateOfBirthInvalid,
      "any.required": siblingProfileDateOfBirthRequired,
    }),
  studying_in_class: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveAcademicClassExists)
    .messages({
      "string.base": siblingProfileStudyingInClassBase,
      "string.empty": siblingProfileStudyingInClassEmpty,
      "any.invalid": siblingProfileStudyingInClassInvalid,
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
        "string.base": siblingProfileSchoolNameBase,
        "string.empty": siblingProfileSchoolNameEmpty,
        "string.min": siblingProfileSchoolNameMinLength,
        "string.max": siblingProfileSchoolNameMaxLength,
        "any.required": siblingProfileSchoolNameRequired,
      }),
    otherwise: Joi.string().trim().lowercase().optional(),
  }),
  admission_number: Joi.when("same_school", {
    is: true,
    then: Joi.string()
      .trim()
      .required()
      .min(siblingProfileAdmissionNumberMinChar)
      .max(siblingProfileAdmissionNumberMaxChar)
      .messages({
        "string.base": siblingProfileAdmissionNumberBase,
        "string.empty": siblingProfileAdmissionNumberEmpty,
        "string.min": siblingProfileAdmissionNumberMinLength,
        "string.max": siblingProfileAdmissionNumberMaxLength,
        "any.required": siblingProfileAdmissionNumberRequired,
      }),
    otherwise: Joi.string().trim().lowercase().optional(),
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": siblingProfileReqBodyBase,
    "object.empty": siblingProfileReqBodyEmpty,
    "object.unknown": siblingProfileReqBodyUnknown,
    "any.required": siblingProfileReqBodyRequired,
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
