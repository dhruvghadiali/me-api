const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const { setValidationMessage } = require("@MEUtils/utility");
const { emailRegex, phoneRegex } = require("@MEHelpers/regex");
const {
  checkValidObjectId,
  isActiveCityExists,
  isActiveStateExists,
  isActiveSchoolExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  addressMaxChar,
  addressMinChar,
  firstNameMaxChar,
  firstNameMinChar,
  lastNameMaxChar,
  lastNameMinChar,
  emailMaxChar,
  emailMinChar,
  phoneNumberChar,
} = require("@MEHelpers/validationConst");
const {
  schoolIdRequired,
  schoolIdInvalid,
  schoolIdNotFound,
  addressEmpty,
  addressRequired,
  addressMinLength,
  addressMaxLength,
  addressInvalidFormate,
  stateNameInvalid,
  stateNameRequired,
  stateNameNotFound,
  districtNameInvalid,
  districtNameRequired,
  districtNameNotFound,
  cityNameInvalid,
  cityNameRequired,
  cityNameNotFound,
  areaNameInvalid,
  areaNameRequired,
  areaNameNotFound,
  zipcodeInvalid,
  zipcodeRequired,
  zipcodeNotFound,
  schoolAddressDetailsEmpty,
  schoolAddressDetailsRequired,
  schoolAddressDetailsMustBeObject,
  schoolAddressDetailsUnknownProperty,
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
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  school_id: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveSchoolExists)
    .required()
    .messages({
      "any.required": schoolIdRequired,
      "any.invalid": schoolIdInvalid,
      "any.notFound": schoolIdNotFound,
    }),
  school_address: Joi.object({
    address: Joi.string()
      .trim()
      .lowercase()
      .min(addressMinChar)
      .max(addressMaxChar)
      .required()
      .messages({
        "string.base": addressInvalidFormate,
        "string.empty": addressEmpty,
        "string.min": addressMinLength,
        "string.max": addressMaxLength,
        "any.required": addressRequired,
      }),
    state: Joi.string()
      .custom(checkValidObjectId)
      .external(isActiveStateExists)
      .required()
      .messages({
        "any.required": stateNameRequired,
        "any.invalid": stateNameInvalid,
        "any.notFound": stateNameNotFound,
      }),
    district: Joi.string()
      .custom(checkValidObjectId)
      .external(isActiveDistrictExists)
      .required()
      .messages({
        "any.required": districtNameRequired,
        "any.invalid": districtNameInvalid,
        "any.notFound": districtNameNotFound,
      }),
    city: Joi.string()
      .custom(checkValidObjectId)
      .external(isActiveCityExists)
      .required()
      .messages({
        "any.required": cityNameRequired,
        "any.invalid": cityNameInvalid,
        "any.notFound": cityNameNotFound,
      }),
    area_name: Joi.string()
      .custom(checkValidObjectId)
      .external(isActiveAreaNameExists)
      .required()
      .messages({
        "any.required": areaNameRequired,
        "any.invalid": areaNameInvalid,
        "any.notFound": areaNameNotFound,
      }),
    zipcode: Joi.string()
      .custom(checkValidObjectId)
      .external(isActiveZipcodeExists)
      .required()
      .messages({
        "any.required": zipcodeRequired,
        "any.invalid": zipcodeInvalid,
        "any.notFound": zipcodeNotFound,
      }),
  })
    .empty({})
    .required()
    .unknown(false)
    .messages({
      "any.required": schoolAddressDetailsRequired,
      "object.base": schoolAddressDetailsMustBeObject,
      "object.empty": schoolAddressDetailsEmpty,
      "object.unknown": schoolAddressDetailsUnknownProperty,
    }),
  school_admin: Joi.object({
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
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": schoolAddressDetailsRequired,
    "object.base": schoolAddressDetailsMustBeObject,
    "object.empty": schoolAddressDetailsEmpty,
    "object.unknown": schoolAddressDetailsUnknownProperty,
  });

const validateSchoolAddressPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);
      next();
    } catch (error) {
      next(
        new ErrorResponse(
          setValidationMessage(error),
          HTTP_STATUS_CODES.STATUS_400,
        ),
      );
    }
  },
);

module.exports = {
  validateSchoolAddressPostReqBody,
};
