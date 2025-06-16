const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

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
  usernameMaxChar,
  usernameMinChar,
  passwordMaxCharWithoutEncryption,
  passwordMinChar,
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
  usernameEmpty,
  usernameBase,
  usernameRequired,
  usernameMinLength,
  usernameMaxLength,
  passwordEmpty,
  passwordBase,
  passwordRequired,
  passwordMinLength,
  passwordMaxLengthWithoutEncryption,
  signInReqBodyRequired,
  signInReqBodyEmpty,
  signInReqBodyBase,
  signInReqBodyUnknown,
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

const validationSignInSchema = Joi.object({
  username: Joi.string()
    .required()
    .empty()
    .trim()
    .min(usernameMinChar)
    .max(usernameMaxChar)
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
    "object.base": signInReqBodyBase,
    "object.empty": signInReqBodyEmpty,
    "object.unknown": signInReqBodyUnknown,
    "any.required": signInReqBodyRequired,
  });

const validateSchoolAdminSignInReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationSignInSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);
module.exports = {
  schoolAdminPostReqBodyValidationSchema,
  validateSchoolAdminSignInReqBody,
};
