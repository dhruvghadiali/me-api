const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const { isUserNameExists } = require("@MEUtils/reqBodyValidator");

const {
  emailMinChar,
  emailMaxChar,
  lastNameMinChar,
  lastNameMaxChar,
  phoneNumberChar,
  usernameMinChar,
  usernameMaxChar,
  firstNameMinChar,
  firstNameMaxChar,
  passwordMinChar,
  passwordMaxCharWithoutEncryption,
} = require("@MEHelpers/validationConst");
const {
  firstNameEmpty,
  firstNameRequired,
  firstNameMinLength,
  firstNameMaxLength,
  firstNameInvalidFormate,
  lastNameEmpty,
  lastNameRequired,
  lastNameMinLength,
  lastNameMaxLength,
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
  usernameBase,
  usernameEmpty,
  usernameRequired,
  usernameMinLength,
  usernameMaxLength,
  passwordBase,
  passwordEmpty,
  passwordRequired,
  passwordMinLength,
  passwordMaxLengthWithoutEncryption,
  studentSignupReqBodyBase,
  studentSignupReqBodyEmpty,
  studentSignupReqBodyUnknown,
  studentSignupReqBodyRequired,
  studentSigninReqBodyBase,
  studentSigninReqBodyEmpty,
  studentSigninReqBodyUnknown,
  studentSigninReqBodyRequired,
} = require("@MEHelpers/validationMessage");
const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const validateStudentSignupPostSchema = Joi.object({
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
  username: Joi.string()
    .required()
    .empty()
    .trim()
    .min(usernameMinChar)
    .max(usernameMaxChar)
    .external(isUserNameExists)
    .messages({
      "string.empty": usernameEmpty,
      "string.base": usernameBase,
      "any.required": usernameRequired,
      "string.min": usernameMinLength,
      "string.max": usernameMaxLength,
    }),
  password: Joi.string()
    .required()
    .empty()
    .trim()
    .min(passwordMinChar)
    .max(passwordMaxCharWithoutEncryption)
    .messages({
      "string.empty": passwordEmpty,
      "string.base": passwordBase,
      "any.required": passwordRequired,
      "string.min": passwordMinLength,
      "string.max": passwordMaxLengthWithoutEncryption,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": studentSignupReqBodyBase,
    "object.empty": studentSignupReqBodyEmpty,
    "object.unknown": studentSignupReqBodyUnknown,
    "any.required": studentSignupReqBodyRequired,
  });

const validateStudentSigninPostSchema = Joi.object({
  username: Joi.string()
    .required()
    .empty()
    .trim()
    .min(usernameMinChar)
    .max(usernameMaxChar)
    .external(isUserNameExists)
    .messages({
      "string.empty": usernameEmpty,
      "string.base": usernameBase,
      "any.required": usernameRequired,
      "string.min": usernameMinLength,
      "string.max": usernameMaxLength,
    }),
  password: Joi.string()
    .required()
    .empty()
    .trim()
    .min(passwordMinChar)
    .max(passwordMaxCharWithoutEncryption)
    .messages({
      "string.empty": passwordEmpty,
      "string.base": passwordBase,
      "any.required": passwordRequired,
      "string.min": passwordMinLength,
      "string.max": passwordMaxLengthWithoutEncryption,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": studentSigninReqBodyBase,
    "object.empty": studentSigninReqBodyEmpty,
    "object.unknown": studentSigninReqBodyUnknown,
    "any.required": studentSigninReqBodyRequired,
  });

const validateStudentSignupPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validateStudentSignupPostSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateStudentSigninPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validateStudentSigninPostSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

module.exports = {
  validateStudentSignupPostReqBody,
  validateStudentSigninPostReqBody,
};
