const Joi = require("joi");

const { phoneRegex } = require("@MEHelpers/regex");
const {
  checkValidObjectId,
  isActiveCityExists,
  isActiveStateExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  addressMaxChar,
  addressMinChar,
  phoneNumberChar,
  schoolAddressArrayMinLength,
  schoolAddressArrayMaxLength,
} = require("@MEHelpers/validationConst");
const {
  phoneNumberEmpty,
  phoneNumberInvalid,
  phoneNumberRequired,
  phoneNumberMinLength,
  phoneNumberMaxLength,
  phoneNumberInvalidFormate,
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
  schoolAddressesDetailsEmpty,
  schoolAddressesDetailsRequired,
  schoolAddressesDetailsMinLength,
  schoolAddressesDetailsMaxLength,
  schoolAddressesDetailsMustBeArray,
} = require("@MEHelpers/validationMessage");

const schoolAddressPostReqBodyValidationSchema = Joi.array()
  .items(
    Joi.object({
      user_phone_number: Joi.string()
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
      })
  )
  .min(schoolAddressArrayMinLength)
  .max(schoolAddressArrayMaxLength)
  .required()
  .messages({
    "array.base": schoolAddressesDetailsMustBeArray,
    "array.empty": schoolAddressesDetailsEmpty,
    "array.min": schoolAddressesDetailsMinLength,
    "array.max": schoolAddressesDetailsMaxLength,
    "array.includesRequiredUnknowns": schoolAddressesDetailsMinLength,
    "any.required": schoolAddressesDetailsRequired,
  });

// exports.putSchoolAddressReqBodyValidationSchema = Joi.array()
//   .items(
//     Joi.object({
//       address: Joi.string()
//         .trim()
//         .lowercase()
//         .min(validationConst.addressMinLength)
//         .max(validationConst.addressMaxLength)
//         .messages({
//           "string.base": validationMessage.addressInvalidFormate,
//           "string.empty": validationMessage.addressEmpty,
//           "string.min": validationMessage.addressMinLength,
//           "string.max": validationMessage.addressMaxLength,
//         }),
//       state: Joi.string()
//         .custom(checkValidObjectId)
//         .external(isStateExists)
//         .messages({
//           "any.invalid": validationMessage.stateNameInvalid,
//           "any.notFound": validationMessage.stateNameNotFound,
//         }),
//       district: Joi.string()
//         .custom(checkValidObjectId)
//         .external(isDistrictExists)
//         .messages({
//           "any.invalid": validationMessage.districtNameInvalid,
//           "any.notFound": validationMessage.districtNameNotFound,
//         }),
//       city: Joi.string()
//         .custom(checkValidObjectId)
//         .external(isCityExists)
//         .messages({
//           "any.invalid": validationMessage.cityNameInvalid,
//           "any.notFound": validationMessage.cityNameNotFound,
//         }),
//       area_name: Joi.string()
//         .custom(checkValidObjectId)
//         .external(isAreaNameExists)
//         .messages({
//           "any.invalid": validationMessage.areaNameInvalid,
//           "any.notFound": validationMessage.areaNameNotFound,
//         }),
//       zipcode: Joi.string()
//         .custom(checkValidObjectId)
//         .external(isZipcodeExists)
//         .messages({
//           "any.invalid": validationMessage.zipcodeInvalid,
//           "any.notFound": validationMessage.zipcodeNotFound,
//         }),
//     })
//       .empty({})
//       .required()
//       .unknown(false)
//       .messages({
//         "any.required": validationMessage.organizationMemberDetailsRequired,
//         "object.base": validationMessage.organizationMemberDetailsMustBeObject,
//         "object.empty": validationMessage.organizationMemberDetailsEmpty,
//         "object.unknown":
//           validationMessage.organizationMemberDetailsUnknownProperty,
//       })
//   )
//   .min(validationConst.organizationMembersDetailsMinLength)
//   .max(validationConst.organizationMembersDetailsMaxLength)
//   .required()
//   .messages({
//     "array.base": validationMessage.organizationMembersDetailsMustBeArray,
//     "array.empty": validationMessage.organizationMembersDetailsEmpty,
//     "array.min": validationMessage.organizationMembersDetailsMinLength,
//     "array.max": validationMessage.organizationMembersDetailsMaxLength,
//     "array.includesRequiredUnknowns":
//       validationMessage.organizationMembersDetailsMinLength,
//     "any.required": validationMessage.organizationMembersDetailsRequired,
//   });

module.exports = {
  schoolAddressPostReqBodyValidationSchema,
  // putSchoolAddressReqBodyValidationSchema,
};
