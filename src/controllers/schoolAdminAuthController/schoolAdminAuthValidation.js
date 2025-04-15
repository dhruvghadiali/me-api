const Joi = require("joi");

const validationMessage = require("@MEHelpers/validationMessage");
const validationConst = require("@MEHelpers/validationConst");

const { emailRegex, phoneRegex } = require("@MEUtils/utility");

exports.schoolAdminSignUpReqBodyValidationSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(validationConst.firstNameMinLength)
    .max(validationConst.firstNameMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.firstNameInvalidFormate,
      "string.empty": validationMessage.firstNameEmpty,
      "string.min": validationMessage.firstNameMinLength,
      "string.max": validationMessage.firstNameMaxLength,
      "any.required": validationMessage.firstNameRequired,
    }),
  last_name: Joi.string()
    .trim()
    .min(validationConst.lastNameMinLength)
    .max(validationConst.lastNameMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.lastNameInvalidFormate,
      "string.empty": validationMessage.lastNameEmpty,
      "string.min": validationMessage.lastNameMinLength,
      "string.max": validationMessage.lastNameMaxLength,
      "any.required": validationMessage.lastNameRequired,
    }),
  email: Joi.string()
    .trim()
    .pattern(emailRegex)
    .min(validationConst.emailMinLength)
    .max(validationConst.emailMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.emailInvalidFormate,
      "string.empty": validationMessage.emailEmpty,
      "string.pattern.base": validationMessage.emailInvalid,
      "string.min": validationMessage.emailMinLength,
      "string.max": validationMessage.emailMaxLength,
      "any.required": validationMessage.emailRequired,
    }),
  phone_number: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .min(validationConst.phoneNumberLength)
    .max(validationConst.phoneNumberLength)
    .required()
    .messages({
      "string.base": validationMessage.phoneNumberInvalidFormate,
      "string.empty": validationMessage.phoneNumberEmpty,
      "string.pattern.base": validationMessage.phoneNumberInvalid,
      "string.min": validationMessage.phoneNumberMinLength,
      "string.max": validationMessage.phoneNumberMaxLength,
      "any.required": validationMessage.phoneNumberRequired,
    }),
  username: Joi.string()
    .trim()
    .min(validationConst.usernameMinLength)
    .max(validationConst.usernameMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.usernameInvalidFormate,
      "string.empty": validationMessage.usernameEmpty,
      "string.min": validationMessage.usernameMinLength,
      "string.max": validationMessage.usernameMaxLength,
      "any.required": validationMessage.usernameRequired,
    }),
  password: Joi.string()
    .trim()
    .min(validationConst.passwordMinLength)
    .max(validationConst.passwordMaxLengthWithoutEncryption)
    .required()
    .messages({
      "string.base": validationMessage.passwordInvalidFormate,
      "string.empty": validationMessage.passwordEmpty,
      "string.min": validationMessage.passwordMinLength,
      "string.max": validationMessage.passwordMaxLengthWithoutEncryption,
      "any.required": validationMessage.passwordRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": validationMessage.userDetailsRequired,
    "object.base": validationMessage.userDetailsMustBeObject,
    "object.empty": validationMessage.userDetailsEmpty,
    "object.unknown": validationMessage.userDetailsUnknownProperty,
  });
