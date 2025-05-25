const Joi = require("joi");

const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const {
  checkValidObjectId,
  isActiveCityExists,
  isActiveStateExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  emailMaxChar,
  emailMinChar,
  addressMaxChar,
  addressMinChar,
  phoneNumberChar,
  organizationNameMaxChar,
  organizationNameMinChar,
  organizationShortNameMaxChar,
  organizationShortNameMinChar,
  governmentRegistrationNumberMaxChar,
  governmentRegistrationNumberMinChar,
} = require("@MEHelpers/validationConst");
const {
  organizationNameEmpty,
  organizationNameRequired,
  organizationNameMinLength,
  organizationNameMaxLength,
  organizationNameInvalidFormate,
  organizationShortNameEmpty,
  organizationShortNameMinLength,
  organizationShortNameMaxLength,
  organizationShortNameInvalidFormate,
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
  governmentRegistrationNumberEmpty,
  governmentRegistrationNumberRequired,
  governmentRegistrationNumberMinLength,
  governmentRegistrationNumberMaxLength,
  governmentRegistrationNumberInvalidFormate,
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
  organizationDetailsEmpty,
  organizationDetailsRequired,
  organizationDetailsMustBeObject,
  organizationDetailsUnknownProperty,
} = require("@MEHelpers/validationMessage");

const organizationPostReqBodyValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(organizationNameMinChar)
    .max(organizationNameMaxChar)
    .required()
    .messages({
      "string.base": organizationNameInvalidFormate,
      "string.empty": organizationNameEmpty,
      "string.min": organizationNameMinLength,
      "string.max": organizationNameMaxLength,
      "any.required": organizationNameRequired,
    }),
  short_name: Joi.string()
    .trim()
    .min(organizationShortNameMinChar)
    .max(organizationShortNameMaxChar)
    .messages({
      "string.base": organizationShortNameInvalidFormate,
      "string.empty": organizationShortNameEmpty,
      "string.min": organizationShortNameMinLength,
      "string.max": organizationShortNameMaxLength,
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
  government_registration_number: Joi.string()
    .trim()
    .min(governmentRegistrationNumberMinChar)
    .max(governmentRegistrationNumberMaxChar)
    .required()
    .messages({
      "string.base": governmentRegistrationNumberInvalidFormate,
      "string.empty": governmentRegistrationNumberEmpty,
      "string.min": governmentRegistrationNumberMinLength,
      "string.max": governmentRegistrationNumberMaxLength,
      "any.required": governmentRegistrationNumberRequired,
    }),
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
    "any.required": organizationDetailsRequired,
    "object.base": organizationDetailsMustBeObject,
    "object.empty": organizationDetailsEmpty,
    "object.unknown": organizationDetailsUnknownProperty,
  });

// exports.putOrganizationReqBodyValidationSchema = Joi.object({
//   name: Joi.string()
//     .trim()
//     .min(validationConst.organizationNameMinLength)
//     .max(validationConst.organizationNameMaxLength)
//     .messages({
//       "string.base": validationMessage.organizationNameInvalidFormate,
//       "string.empty": validationMessage.organizationNameEmpty,
//       "string.min": validationMessage.organizationNameMinLength,
//       "string.max": validationMessage.organizationNameMaxLength,
//     }),
//   short_name: Joi.string()
//     .trim()
//     .min(validationConst.organizationShortNameMinLength)
//     .max(validationConst.organizationShortNameMaxLength)
//     .messages({
//       "string.base": validationMessage.organizationShortNameInvalidFormate,
//       "string.empty": validationMessage.organizationShortNameEmpty,
//       "string.min": validationMessage.organizationShortNameMinLength,
//       "string.max": validationMessage.organizationShortNameMaxLength,
//     }),
//   email: Joi.string()
//     .trim()
//     .pattern(emailRegex)
//     .min(validationConst.emailMinLength)
//     .max(validationConst.emailMaxLength)
//     .messages({
//       "string.base": validationMessage.organizationShortNameInvalidFormate,
//       "string.empty": validationMessage.organizationShortNameEmpty,
//       "string.pattern.base": validationMessage.emailInvalid,
//       "string.min": validationMessage.emailMinLength,
//       "string.max": validationMessage.emailMaxLength,
//     }),
//   phone_number: Joi.string()
//     .trim()
//     .pattern(phoneRegex)
//     .min(validationConst.phoneNumberLength)
//     .max(validationConst.phoneNumberLength)
//     .messages({
//       "string.base": validationMessage.phoneNumberInvalidFormate,
//       "string.empty": validationMessage.phoneNumberEmpty,
//       "string.pattern.base": validationMessage.phoneNumberInvalid,
//       "string.min": validationMessage.phoneNumberMinLength,
//       "string.max": validationMessage.phoneNumberMaxLength,
//     }),
//   government_registration_number: Joi.string()
//     .trim()
//     .min(validationConst.governmentRegistrationNumberMinLength)
//     .max(validationConst.governmentRegistrationNumberMaxLength)
//     .messages({
//       "string.base":
//         validationMessage.governmentRegistrationNumberInvalidFormate,
//       "string.empty": validationMessage.governmentRegistrationNumberEmpty,
//       "string.min": validationMessage.governmentRegistrationNumberMinLength,
//       "string.max": validationMessage.governmentRegistrationNumberMaxLength,
//     }),
//   address: Joi.string()
//     .trim()
//     .lowercase()
//     .min(validationConst.addressMinLength)
//     .max(validationConst.addressMaxLength)
//     .messages({
//       "string.base": validationMessage.addressInvalidFormate,
//       "string.empty": validationMessage.addressEmpty,
//       "string.min": validationMessage.addressMinLength,
//       "string.max": validationMessage.addressMaxLength,
//     }),
//   state: Joi.string()
//     .custom(checkValidObjectId)
//     .external(isStateExists)
//     .messages({
//       "any.invalid": validationMessage.stateNameInvalid,
//       "any.notFound": validationMessage.stateNameNotFound,
//     }),
//   district: Joi.string()
//     .custom(checkValidObjectId)
//     .external(isDistrictExists)
//     .messages({
//       "any.invalid": validationMessage.districtNameInvalid,
//       "any.notFound": validationMessage.districtNameNotFound,
//     }),
//   city: Joi.string()
//     .custom(checkValidObjectId)
//     .external(isCityExists)
//     .messages({
//       "any.invalid": validationMessage.cityNameInvalid,
//       "any.notFound": validationMessage.cityNameNotFound,
//     }),
//   area_name: Joi.string()
//     .custom(checkValidObjectId)
//     .external(isAreaNameExists)
//     .messages({
//       "any.invalid": validationMessage.areaNameInvalid,
//       "any.notFound": validationMessage.areaNameNotFound,
//     }),
//   zipcode: Joi.string()
//     .custom(checkValidObjectId)
//     .external(isZipcodeExists)
//     .messages({
//       "any.invalid": validationMessage.zipcodeInvalid,
//       "any.notFound": validationMessage.zipcodeNotFound,
//     }),
// })
//   .empty({})
//   .required()
//   .unknown(false)
//   .messages({
//     "any.required": validationMessage.organizationDetailsRequired,
//     "object.base": validationMessage.organizationDetailsMustBeObject,
//     "object.empty": validationMessage.organizationDetailsEmpty,
//     "object.unknown": validationMessage.organizationDetailsUnknownProperty,
//   });

module.exports = {
  organizationPostReqBodyValidationSchema,
  // putOrganizationReqBodyValidationSchema,
};
