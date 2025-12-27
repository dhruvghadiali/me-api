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
  firstNameBase,
  firstNameEmpty,
  lastNameMinLength,
  lastNameMaxLength,
  lastNameBase,
  lastNameEmpty,
  siblingProfileGenderBase,
  siblingProfileGenderEmpty,
  siblingProfileGenderInvalid,
  siblingProfileDateOfBirthInvalid,
  siblingProfileDateOfBirthBase,
  siblingProfileDateOfBirthEmpty,
  siblingProfileStudyingInClassBase,
  siblingProfileStudyingInClassEmpty,
  siblingProfileStudyingInClassInvalid,
  siblingProfileSchoolNameBase,
  siblingProfileSchoolNameEmpty,
  siblingProfileSchoolNameMinLength,
  siblingProfileSchoolNameMaxLength,
  siblingProfileAdmissionNumberBase,
  siblingProfileAdmissionNumberMinLength,
  siblingProfileAdmissionNumberMaxLength,
  siblingProfileAdmissionNumberEmpty,
  siblingProfileReqBodyBase,
  siblingProfileReqBodyEmpty,
  siblingProfileReqBodyUnknown,
  siblingProfileReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const validationPutSchema = Joi.object({
  first_name: Joi.string()
    .trim()
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
    .valid(...Object.values(GENDERS))
    .messages({
      "string.base": siblingProfileGenderBase,
      "string.empty": siblingProfileGenderEmpty,
      "any.only": siblingProfileGenderInvalid,
    }),
  date_of_birth: Joi.date()
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
  same_school: Joi.boolean().optional(),
  school_name: Joi.when("same_school", {
    is: false,
    then: Joi.string()
      .trim()
      .lowercase()
      .optional()
      .min(siblingProfileSchoolNameMinChar)
      .max(siblingProfileSchoolNameMaxChar)
      .messages({
        "string.base": siblingProfileSchoolNameBase,
        "string.empty": siblingProfileSchoolNameEmpty,
        "string.min": siblingProfileSchoolNameMinLength,
        "string.max": siblingProfileSchoolNameMaxLength,
      }),
    otherwise: Joi.string().trim().lowercase().optional(),
  }),
  admission_number: Joi.when("same_school", {
    is: true,
    then: Joi.string()
      .trim()
      .optional()
      .min(siblingProfileAdmissionNumberMinChar)
      .max(siblingProfileAdmissionNumberMaxChar)
      .messages({
        "string.base": siblingProfileAdmissionNumberBase,
        "string.empty": siblingProfileAdmissionNumberEmpty,
        "string.min": siblingProfileAdmissionNumberMinLength,
        "string.max": siblingProfileAdmissionNumberMaxLength,
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
