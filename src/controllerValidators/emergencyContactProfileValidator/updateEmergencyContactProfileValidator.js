const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { phoneRegex } = require("@MEHelpers/regex");
const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
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
  emailEmpty,
  emailInvalid,
  emailMaxLength,
  emailMinLength,
  phoneNumberInvalid,
  emergencyContactNameMinLength,
  emergencyContactNameMaxLength,
  emergencyContactRelationInvalid,
  emergencyContactNameBase,
  emergencyContactNameEmpty,
  emergencyContactRelationBase,
  emergencyContactRelationEmpty,
  phoneNumberBase,
  phoneNumberEmpty,
  emergencyContactAlternatePhoneBase,
  emergencyContactAlternatePhoneEmpty,
  emergencyContactAlternatePhoneInvalid,
  emailBase,
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

const validationPutSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional()
    .min(emergencyContactNameMinChar)
    .max(emergencyContactNameMaxChar)
    .messages({
      "string.base": emergencyContactNameBase,
      "string.empty": emergencyContactNameEmpty,
      "string.min": emergencyContactNameMinLength,
      "string.max": emergencyContactNameMaxLength,
    }),
  relation: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .valid(...Object.values(EMERGENCY_CONTACT_RELATIONS))
    .messages({
      "string.base": emergencyContactRelationBase,
      "string.empty": emergencyContactRelationEmpty,
      "any.only": emergencyContactRelationInvalid,
    }),
  phone_number: Joi.string()
    .trim()
    .optional()
    .length(phoneNumberChar)
    .pattern(phoneRegex)
    .messages({
      "string.base": phoneNumberBase,
      "string.empty": phoneNumberEmpty,
      "string.length": phoneNumberMaxLength,
      "string.pattern.base": phoneNumberInvalid,
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
  .unknown(false)
  .messages({
    "object.base": emergencyContactReqBodyBase,
    "object.empty": emergencyContactReqBodyEmpty,
    "object.unknown": emergencyContactReqBodyUnknown,
    "any.required": emergencyContactReqBodyRequired,
  });

const validateUpdateEmergencyContactProfilePutReqBody = asyncHandler(
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
  validateUpdateEmergencyContactProfilePutReqBody,
};
