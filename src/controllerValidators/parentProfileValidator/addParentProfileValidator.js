const _ = require("lodash");
const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");
const ParentProfile = require("@MEModels/parentProfileModel");

const { phoneRegex } = require("@MEHelpers/regex");
const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
const {
  HTTP_STATUS_CODES,
  PARENT_TYPES,
  PARENT_OCCUPATIONS_IN,
  EDUCATION_LEVELS_IN,
} = require("@ME/helpers/enums");
const {
  emailMaxChar,
  emailMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  phoneNumberChar,
  firstNameMaxChar,
  firstNameMinChar,
  aadhaarNumberChar,
  parentProfileAnnualIncomeMinValue,
  parentProfileAnnualIncomeMaxValue,
  parentProfileCaringChildByMinChar,
  parentProfileCaringChildByMaxChar,
} = require("@MEHelpers/validationConst");
const {
  emailInvalid,
  emailRequired,
  emailMaxLength,
  emailMinLength,
  lastNameRequired,
  lastNameMaxLength,
  lastNameMinLength,
  firstNameRequired,
  firstNameMaxLength,
  firstNameMinLength,
  phoneNumberInvalid,
  phoneNumberRequired,
  aadhaarNumberRequired,
  parentProfileAnnualIncomeInvalid,
  parentProfileOccupationInvalid,
  parentProfileCaringChildByMinLength,
  parentProfileCaringChildByMaxLength,
  parentProfileCaringChildByRequired,
  firstNameBase,
  firstNameEmpty,
  lastNameBase,
  lastNameEmpty,
  phoneNumberBase,
  phoneNumberEmpty,
  phoneNumberMaxLength,
  emailBase,
  emailEmpty,
  aadhaarNumberBase,
  aadhaarNumberEmpty,
  aadhaarNumberMaxLength,
  parentProfileOccupationBase,
  parentProfileOccupationEmpty,
  parentProfileOccupationRequired,
  parentProfileEducationBase,
  parentProfileEducationEmpty,
  parentProfileEducationInvalid,
  parentProfileEducationRequired,
  parentProfileParentTypeBase,
  parentProfileParentTypeEmpty,
  parentProfileParentTypeInvalid,
  parentProfileParentTypeRequired,
  parentProfileAnnualIncomeBase,
  parentProfileAnnualIncomeInvalid,
  parentProfileAnnualIncomeRequired,
  parentProfileDateOfDeathBase,
  parentProfileDateOfDeathInvalid,
  parentProfileDateOfDeathRequired,
  parentProfileCaringChildByBase,
  parentProfileCaringChildByEmpty,
  parentProfileReqBodyBase,
  parentProfileReqBodyEmpty,
  parentProfileReqBodyUnknown,
  parentProfileReqBodyRequired,
  parentProfileParentTypeDuplicate,
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
  phone_number: Joi.string()
    .trim()
    .required()
    .length(phoneNumberChar)
    .pattern(phoneRegex)
    .messages({
      "string.base": phoneNumberBase,
      "string.empty": phoneNumberEmpty,
      "string.length": phoneNumberMaxLength,
      "string.pattern.base": phoneNumberInvalid,
      "any.required": phoneNumberRequired,
    }),
  email: Joi.string()
    .trim()
    .required()
    .min(emailMinChar)
    .max(emailMaxChar)
    .email()
    .messages({
      "string.base": emailBase,
      "string.empty": emailEmpty,
      "string.min": emailMinLength,
      "string.max": emailMaxLength,
      "string.email": emailInvalid,
      "any.required": emailRequired,
    }),
  aadhaar_number: Joi.string()
    .trim()
    .lowercase()
    .required()
    .length(aadhaarNumberChar)
    .messages({
      "string.base": aadhaarNumberBase,
      "string.empty": aadhaarNumberEmpty,
      "string.length": aadhaarNumberMaxLength,
      "any.required": aadhaarNumberRequired,
    }),
  occupation: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(PARENT_OCCUPATIONS_IN))
    .messages({
      "string.base": parentProfileOccupationBase,
      "string.empty": parentProfileOccupationEmpty,
      "any.only": parentProfileOccupationInvalid,
      "any.required": parentProfileOccupationRequired,
    }),
  education: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(EDUCATION_LEVELS_IN))
    .messages({
      "string.base": parentProfileEducationBase,
      "string.empty": parentProfileEducationEmpty,
      "any.only": parentProfileEducationInvalid,
      "any.required": parentProfileEducationRequired,
    }),
  parent_type: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(PARENT_TYPES))
    .messages({
      "string.base": parentProfileParentTypeBase,
      "string.empty": parentProfileParentTypeEmpty,
      "any.only": parentProfileParentTypeInvalid,
      "any.required": parentProfileParentTypeRequired,
    }),
  annual_income: Joi.number()
    .required()
    .greater(parentProfileAnnualIncomeMinValue)
    .less(parentProfileAnnualIncomeMaxValue)
    .messages({
      "number.base": parentProfileAnnualIncomeBase,
      "number.greater": parentProfileAnnualIncomeInvalid,
      "number.less": parentProfileAnnualIncomeInvalid,
      "any.required": parentProfileAnnualIncomeRequired,
    }),
  same_address_as_student: Joi.boolean().optional().default(true),
  alive: Joi.object({
    status: Joi.boolean().optional().default(true),
    date_of_death: Joi.when("status", {
      is: false,
      then: Joi.date().required().max("now").messages({
        "date.base": parentProfileDateOfDeathBase,
        "date.max": parentProfileDateOfDeathInvalid,
        "any.required": parentProfileDateOfDeathRequired,
      }),
      otherwise: Joi.date().optional(),
    }),
    caring_child_by: Joi.when("status", {
      is: false,
      then: Joi.string()
        .trim()
        .required()
        .min(parentProfileCaringChildByMinChar)
        .max(parentProfileCaringChildByMaxChar)
        .messages({
          "string.base": parentProfileCaringChildByBase,
          "string.empty": parentProfileCaringChildByEmpty,
          "string.min": parentProfileCaringChildByMinLength,
          "string.max": parentProfileCaringChildByMaxLength,
          "any.required": parentProfileCaringChildByRequired,
        }),
      otherwise: Joi.string().trim().optional(),
    }),
  }).optional(),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": parentProfileReqBodyBase,
    "object.empty": parentProfileReqBodyEmpty,
    "object.unknown": parentProfileReqBodyUnknown,
    "any.required": parentProfileReqBodyRequired,
  });

const validateAddParentProfilePostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);

      // Check for duplicate parent profile entry with same parent_type
      const duplicateProfile = await ParentProfile.findOne({
        user: req.user?.id,
        parent_type: _.lowerCase(req.body?.parent_type || ""),
      });

      if (duplicateProfile) {
        return next(
          new ErrorResponse(
            parentProfileParentTypeDuplicate,
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }

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
  validateAddParentProfilePostReqBody,
};
