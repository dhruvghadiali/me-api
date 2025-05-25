const Joi = require("joi");

const {
  firstNameMaxChar,
  firstNameMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  emailMaxChar,
  emailMinChar,
  phoneNumberChar,
  schoolAdminArrayMaxLength,
  schoolAdminArrayMinLength,
} = require("@MEHelpers/validationConst");
const {
  firstNameEmpty,
  firstNameMinLength,
  firstNameMaxLength,
  firstNameRequired,
  firstNameInvalidFormate,
  lastNameEmpty,
  lastNameMinLength,
  lastNameMaxLength,
  lastNameRequired,
  lastNameInvalidFormate,
  emailEmpty,
  emailInvalid,
  emailRequired,
  emailMinLength,
  emailMaxLength,
  emailInvalidFormate,
  phoneNumberEmpty,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMinLength,
  phoneNumberMaxLength,
  phoneNumberInvalidFormate,
  schoolAdminDetailsEmpty,
  schoolAdminDetailsRequired,
  schoolAdminDetailsMustBeObject,
  schoolAdminDetailsUnknownProperty,
  schoolAdminsDetailsEmpty,
  schoolAdminsDetailsRequired,
  schoolAdminsDetailsMinLength,
  schoolAdminsDetailsMaxLength,
  schoolAdminsDetailsMustBeArray,
} = require("@MEHelpers/validationMessage");

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const schoolAdminPostReqBodyValidationSchema = Joi.array()
  .items(
    Joi.object({
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
    })
      .empty({})
      .required()
      .unknown(false)
      .messages({
        "any.required": schoolAdminDetailsRequired,
        "object.base": schoolAdminDetailsMustBeObject,
        "object.empty": schoolAdminDetailsEmpty,
        "object.unknown": schoolAdminDetailsUnknownProperty,
      })
  )
  .min(schoolAdminArrayMinLength)
  .max(schoolAdminArrayMaxLength)
  .required()
  .messages({
    "array.base": schoolAdminsDetailsMustBeArray,
    "array.empty": schoolAdminsDetailsEmpty,
    "array.min": schoolAdminsDetailsMinLength,
    "array.max": schoolAdminsDetailsMaxLength,
    "array.includesRequiredUnknowns": schoolAdminsDetailsMinLength,
    "any.required": schoolAdminsDetailsRequired,
  });

module.exports = {
  schoolAdminPostReqBodyValidationSchema,
};
