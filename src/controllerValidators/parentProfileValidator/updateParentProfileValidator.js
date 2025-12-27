const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  HTTP_STATUS_CODES,
  PARENT_OCCUPATIONS_IN,
  EDUCATION_LEVELS_IN,
} = require("@ME/helpers/enums");
const {
  checkValidObjectId,
  isActiveAddressExists,
} = require("@MEUtils/reqBodyValidator");
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
  emailMaxLength,
  emailMinLength,
  emailBase,
  emailEmpty,
  lastNameMaxLength,
  lastNameMinLength,
  lastNameBase,
  lastNameEmpty,
  firstNameMaxLength,
  firstNameMinLength,
  firstNameBase,
  firstNameEmpty,
  phoneNumberInvalid,
  phoneNumberBase,
  phoneNumberEmpty,
  phoneNumberLength,
  aadhaarNumberRequired,
  aadhaarNumberBase,
  aadhaarNumberEmpty,
  occupationBase,
  occupationInvalid,
  educationBase,
  educationInvalid,
  parentProfileAnnualIncomeInvalid,
  parentProfileOccupationInvalid,
  parentProfileEducationInvalid,
  parentProfileDateOfDeathInvalid,
  addressBase,
  addressEmpty,
  addressInvalid,
  parentProfileCaringChildByMinLength,
  parentProfileCaringChildByMaxLength,
  parentProfileCaringChildByRequired,
  parentProfileCaringChildByBase,
  parentProfileCaringChildByEmpty,
  dateOfDeathBase,
  dateOfDeathRequired,
  reqBodyBase,
  reqBodyUnknown,
  annualIncomeBase,
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
  phone_number: Joi.string()
    .trim()
    .optional()
    .length(phoneNumberChar)
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.base": phoneNumberBase,
      "string.empty": phoneNumberEmpty,
      "string.length": phoneNumberLength,
      "string.pattern.base": phoneNumberInvalid,
    }),
  email: Joi.string()
    .trim()
    .optional()
    .min(emailMinChar)
    .max(emailMaxChar)
    .email()
    .messages({
      "string.base": emailBase,
      "string.empty": emailEmpty,
      "string.min": emailMinLength,
      "string.max": emailMaxLength,
      "string.email": emailInvalid,
    }),
  aadhaar_number: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .length(aadhaarNumberChar)
    .messages({
      "string.base": aadhaarNumberBase,
      "string.empty": aadhaarNumberEmpty,
      "string.length": aadhaarNumberRequired,
    }),
  occupation: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .valid(...Object.values(PARENT_OCCUPATIONS_IN))
    .messages({
      "string.base": occupationBase,
      "any.only": parentProfileOccupationInvalid,
    }),
  education: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .valid(...Object.values(EDUCATION_LEVELS_IN))
    .messages({
      "string.base": educationBase,
      "any.only": parentProfileEducationInvalid,
    }),
  annual_income: Joi.number()
    .optional()
    .greater(parentProfileAnnualIncomeMinValue)
    .less(parentProfileAnnualIncomeMaxValue)
    .messages({
      "number.base": annualIncomeBase,
      "number.greater": parentProfileAnnualIncomeInvalid,
      "number.less": parentProfileAnnualIncomeInvalid,
    }),
  same_address_as_student: Joi.boolean().optional(),
  address_override: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveAddressExists)
    .messages({
      "string.base": addressBase,
      "string.empty": addressEmpty,
      "any.invalid": addressInvalid,
    }),
  alive: Joi.object({
    status: Joi.boolean().optional(),
    date_of_death: Joi.when("status", {
      is: false,
      then: Joi.date().required().max("now").messages({
        "date.base": dateOfDeathBase,
        "date.max": parentProfileDateOfDeathInvalid,
        "any.required": dateOfDeathRequired,
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
  .unknown(false)
  .messages({
    "object.base": reqBodyBase,
    "object.unknown": reqBodyUnknown,
  });

const validateUpdateParentProfilePutReqBody = asyncHandler(
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
  validateUpdateParentProfilePutReqBody,
};
