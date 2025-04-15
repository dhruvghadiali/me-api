const Joi = require("joi");

const validationMessage = require("@MEHelpers/validationMessage");
const validationConst = require("@MEHelpers/validationConst");

const { emailRegex, phoneRegex } = require("@MEUtils/utility");
const {
  isCityExists,
  isStateExists,
  isZipcodeExists,
  isDistrictExists,
  isAreaNameExists,
  checkValidObjectId,
} = require("@MEUtils/reqBodyValidator");

exports.postOrganizationReqBodyValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(validationConst.organizationNameMinLength)
    .max(validationConst.organizationNameMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.organizationNameInvalidFormate,
      "string.empty": validationMessage.organizationNameEmpty,
      "string.min": validationMessage.organizationNameMinLength,
      "string.max": validationMessage.organizationNameMaxLength,
      "any.required": validationMessage.organizationNameRequired,
    }),
  short_name: Joi.string()
    .trim()
    .min(validationConst.organizationShortNameMinLength)
    .max(validationConst.organizationShortNameMaxLength)
    .messages({
      "string.base": validationMessage.organizationShortNameInvalidFormate,
      "string.empty": validationMessage.organizationShortNameEmpty,
      "string.min": validationMessage.organizationShortNameMinLength,
      "string.max": validationMessage.organizationShortNameMaxLength,
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
  government_registration_number: Joi.string()
    .trim()
    .min(validationConst.governmentRegistrationNumberMinLength)
    .max(validationConst.governmentRegistrationNumberMaxLength)
    .required()
    .messages({
      "string.base":
        validationMessage.governmentRegistrationNumberInvalidFormate,
      "string.empty": validationMessage.governmentRegistrationNumberEmpty,
      "string.min": validationMessage.governmentRegistrationNumberMinLength,
      "string.max": validationMessage.governmentRegistrationNumberMaxLength,
      "any.required": validationMessage.governmentRegistrationNumberRequired,
    }),
  address: Joi.string()
    .trim()
    .lowercase()
    .min(validationConst.addressMinLength)
    .max(validationConst.addressMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.addressInvalidFormate,
      "string.empty": validationMessage.addressEmpty,
      "string.min": validationMessage.addressMinLength,
      "string.max": validationMessage.addressMaxLength,
      "any.required": validationMessage.addressRequired,
    }),
  state: Joi.string()
    .custom(checkValidObjectId)
    .external(isStateExists)
    .required()
    .messages({
      "any.required": validationMessage.stateNameRequired,
      "any.invalid": validationMessage.stateNameInvalid,
      "any.notFound": validationMessage.stateNameNotFound,
    }),
  district: Joi.string()
    .custom(checkValidObjectId)
    .external(isDistrictExists)
    .required()
    .messages({
      "any.required": validationMessage.districtNameRequired,
      "any.invalid": validationMessage.districtNameInvalid,
      "any.notFound": validationMessage.districtNameNotFound,
    }),
  city: Joi.string()
    .custom(checkValidObjectId)
    .external(isCityExists)
    .required()
    .messages({
      "any.required": validationMessage.cityNameRequired,
      "any.invalid": validationMessage.cityNameInvalid,
      "any.notFound": validationMessage.cityNameNotFound,
    }),
  area_name: Joi.string()
    .custom(checkValidObjectId)
    .external(isAreaNameExists)
    .required()
    .messages({
      "any.required": validationMessage.areaNameRequired,
      "any.invalid": validationMessage.areaNameInvalid,
      "any.notFound": validationMessage.areaNameNotFound,
    }),
  zipcode: Joi.string()
    .custom(checkValidObjectId)
    .external(isZipcodeExists)
    .required()
    .messages({
      "any.required": validationMessage.zipcodeRequired,
      "any.invalid": validationMessage.zipcodeInvalid,
      "any.notFound": validationMessage.zipcodeNotFound,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": validationMessage.organizationDetailsRequired,
    "object.base": validationMessage.organizationDetailsMustBeObject,
    "object.empty": validationMessage.organizationDetailsEmpty,
    "object.unknown": validationMessage.organizationDetailsUnknownProperty,
  });

exports.putOrganizationReqBodyValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(validationConst.organizationNameMinLength)
    .max(validationConst.organizationNameMaxLength)
    .messages({
      "string.base": validationMessage.organizationNameInvalidFormate,
      "string.empty": validationMessage.organizationNameEmpty,
      "string.min": validationMessage.organizationNameMinLength,
      "string.max": validationMessage.organizationNameMaxLength,
    }),
  short_name: Joi.string()
    .trim()
    .min(validationConst.organizationShortNameMinLength)
    .max(validationConst.organizationShortNameMaxLength)
    .messages({
      "string.base": validationMessage.organizationShortNameInvalidFormate,
      "string.empty": validationMessage.organizationShortNameEmpty,
      "string.min": validationMessage.organizationShortNameMinLength,
      "string.max": validationMessage.organizationShortNameMaxLength,
    }),
  email: Joi.string()
    .trim()
    .pattern(emailRegex)
    .min(validationConst.emailMinLength)
    .max(validationConst.emailMaxLength)
    .messages({
      "string.base": validationMessage.organizationShortNameInvalidFormate,
      "string.empty": validationMessage.organizationShortNameEmpty,
      "string.pattern.base": validationMessage.emailInvalid,
      "string.min": validationMessage.emailMinLength,
      "string.max": validationMessage.emailMaxLength,
    }),
  phone_number: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .min(validationConst.phoneNumberLength)
    .max(validationConst.phoneNumberLength)
    .messages({
      "string.base": validationMessage.phoneNumberInvalidFormate,
      "string.empty": validationMessage.phoneNumberEmpty,
      "string.pattern.base": validationMessage.phoneNumberInvalid,
      "string.min": validationMessage.phoneNumberMinLength,
      "string.max": validationMessage.phoneNumberMaxLength,
    }),
  government_registration_number: Joi.string()
    .trim()
    .min(validationConst.governmentRegistrationNumberMinLength)
    .max(validationConst.governmentRegistrationNumberMaxLength)
    .messages({
      "string.base":
        validationMessage.governmentRegistrationNumberInvalidFormate,
      "string.empty": validationMessage.governmentRegistrationNumberEmpty,
      "string.min": validationMessage.governmentRegistrationNumberMinLength,
      "string.max": validationMessage.governmentRegistrationNumberMaxLength,
    }),
  address: Joi.string()
    .trim()
    .lowercase()
    .min(validationConst.addressMinLength)
    .max(validationConst.addressMaxLength)
    .messages({
      "string.base": validationMessage.addressInvalidFormate,
      "string.empty": validationMessage.addressEmpty,
      "string.min": validationMessage.addressMinLength,
      "string.max": validationMessage.addressMaxLength,
    }),
  state: Joi.string()
    .custom(checkValidObjectId)
    .external(isStateExists)
    .messages({
      "any.invalid": validationMessage.stateNameInvalid,
      "any.notFound": validationMessage.stateNameNotFound,
    }),
  district: Joi.string()
    .custom(checkValidObjectId)
    .external(isDistrictExists)
    .messages({
      "any.invalid": validationMessage.districtNameInvalid,
      "any.notFound": validationMessage.districtNameNotFound,
    }),
  city: Joi.string()
    .custom(checkValidObjectId)
    .external(isCityExists)
    .messages({
      "any.invalid": validationMessage.cityNameInvalid,
      "any.notFound": validationMessage.cityNameNotFound,
    }),
  area_name: Joi.string()
    .custom(checkValidObjectId)
    .external(isAreaNameExists)
    .messages({
      "any.invalid": validationMessage.areaNameInvalid,
      "any.notFound": validationMessage.areaNameNotFound,
    }),
  zipcode: Joi.string()
    .custom(checkValidObjectId)
    .external(isZipcodeExists)
    .messages({
      "any.invalid": validationMessage.zipcodeInvalid,
      "any.notFound": validationMessage.zipcodeNotFound,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": validationMessage.organizationDetailsRequired,
    "object.base": validationMessage.organizationDetailsMustBeObject,
    "object.empty": validationMessage.organizationDetailsEmpty,
    "object.unknown": validationMessage.organizationDetailsUnknownProperty,
  });
