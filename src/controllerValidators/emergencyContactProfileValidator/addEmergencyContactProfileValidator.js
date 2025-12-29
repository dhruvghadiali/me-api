const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { phoneRegex } = require("@MEHelpers/regex");
const { checkValidObjectId } = require("@MEUtils/reqBodyValidator");
const {
  HTTP_STATUS_CODES,
  EMERGENCY_CONTACT_RELATIONS,
} = require("@ME/helpers/enums");
const {
  emailMaxChar,
  emailMinChar,
  phoneNumberChar,
  emergencyContactNameMinChar,
  emergencyContactNameMaxChar,
  emergencyContactAddressMinChar,
  emergencyContactAddressMaxChar,
} = require("@MEHelpers/validationConst");
const {
  usernameInvalid,
  usernameRequired,
  emergencyContactNameBase,
  emergencyContactNameEmpty,
  emergencyContactNameRequired,
  emergencyContactNameMinLength,
  emergencyContactNameMaxLength,
  emergencyContactRelationBase,
  emergencyContactRelationEmpty,
  emergencyContactRelationRequired,
  emergencyContactRelationInvalid,
  phoneNumberBase,
  phoneNumberEmpty,
  phoneNumberRequired,
  phoneNumberInvalid,
  emergencyContactAlternatePhoneBase,
  emergencyContactAlternatePhoneEmpty,
  emergencyContactAlternatePhoneInvalid,
  emailBase,
  emailEmpty,
  emailMinLength,
  emailMaxLength,
  emailInvalid,
  emergencyContactAddressBase,
  emergencyContactAddressEmpty,
  emergencyContactAddressMinLength,
  emergencyContactAddressMaxLength,
  emergencyContactReqBodyBase,
  emergencyContactReqBodyEmpty,
  emergencyContactReqBodyUnknown,
  emergencyContactReqBodyRequired,
  phoneNumberMaxLength,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  user: Joi.string().trim().required().custom(checkValidObjectId).messages({
    "string.base": usernameInvalid,
    "string.empty": usernameInvalid,
    "any.invalid": usernameInvalid,
    "any.required": usernameRequired,
  }),
  name: Joi.string()
    .trim()
    .required()
    .min(emergencyContactNameMinChar)
    .max(emergencyContactNameMaxChar)
    .messages({
      "string.base": emergencyContactNameBase,
      "string.empty": emergencyContactNameEmpty,
      "string.min": emergencyContactNameMinLength,
      "string.max": emergencyContactNameMaxLength,
      "any.required": emergencyContactNameRequired,
    }),
  relation: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(EMERGENCY_CONTACT_RELATIONS))
    .messages({
      "string.base": emergencyContactRelationBase,
      "string.empty": emergencyContactRelationEmpty,
      "any.only": emergencyContactRelationInvalid,
      "any.required": emergencyContactRelationRequired,
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
  alternate_phone: Joi.string()
    .trim()
    .optional()
    .length(phoneNumberChar)
    .pattern(phoneRegex)
    .messages({
      "string.base": emergencyContactAlternatePhoneBase,
      "string.empty": emergencyContactAlternatePhoneEmpty,
      "string.length": phoneNumberMaxLength,
      "string.pattern.base": emergencyContactAlternatePhoneInvalid,
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
  address: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .min(emergencyContactAddressMinChar)
    .max(emergencyContactAddressMaxChar)
    .messages({
      "string.base": emergencyContactAddressBase,
      "string.empty": emergencyContactAddressEmpty,
      "string.min": emergencyContactAddressMinLength,
      "string.max": emergencyContactAddressMaxLength,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": emergencyContactReqBodyBase,
    "object.empty": emergencyContactReqBodyEmpty,
    "object.unknown": emergencyContactReqBodyUnknown,
    "any.required": emergencyContactReqBodyRequired,
  });

const validateAddEmergencyContactProfilePostReqBody = asyncHandler(
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
  validateAddEmergencyContactProfilePostReqBody,
};
