const Joi = require("joi");

const validationMessage = require("@MEHelpers/validationMessage");
const {
  schoolAdminSignUpReqBodyValidationSchema,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthValidation");
const validationConst = require("@MEHelpers/validationConst");

const {
  isCityExists,
  isStateExists,
  isZipcodeExists,
  isDistrictExists,
  isAreaNameExists,
  checkValidObjectId,
} = require("@MEHelpers/reqBodyValidator");

exports.postSchoolAddressReqBodyValidationSchema = Joi.array()
  .items(
    Joi.object({
      user: schoolAdminSignUpReqBodyValidationSchema,
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
        "any.required": validationMessage.organizationMemberDetailsRequired,
        "object.base": validationMessage.organizationMemberDetailsMustBeObject,
        "object.empty": validationMessage.organizationMemberDetailsEmpty,
        "object.unknown":
          validationMessage.organizationMemberDetailsUnknownProperty,
      })
  )
  .min(validationConst.organizationMembersDetailsMinLength)
  .max(validationConst.organizationMembersDetailsMaxLength)
  .required()
  .messages({
    "array.base": validationMessage.organizationMembersDetailsMustBeArray,
    "array.empty": validationMessage.organizationMembersDetailsEmpty,
    "array.min": validationMessage.organizationMembersDetailsMinLength,
    "array.max": validationMessage.organizationMembersDetailsMaxLength,
    "array.includesRequiredUnknowns":
      validationMessage.organizationMembersDetailsMinLength,
    "any.required": validationMessage.organizationMembersDetailsRequired,
  });

exports.putSchoolAddressReqBodyValidationSchema = Joi.array()
  .items(
    Joi.object({
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
        "any.required": validationMessage.organizationMemberDetailsRequired,
        "object.base": validationMessage.organizationMemberDetailsMustBeObject,
        "object.empty": validationMessage.organizationMemberDetailsEmpty,
        "object.unknown":
          validationMessage.organizationMemberDetailsUnknownProperty,
      })
  )
  .min(validationConst.organizationMembersDetailsMinLength)
  .max(validationConst.organizationMembersDetailsMaxLength)
  .required()
  .messages({
    "array.base": validationMessage.organizationMembersDetailsMustBeArray,
    "array.empty": validationMessage.organizationMembersDetailsEmpty,
    "array.min": validationMessage.organizationMembersDetailsMinLength,
    "array.max": validationMessage.organizationMembersDetailsMaxLength,
    "array.includesRequiredUnknowns":
      validationMessage.organizationMembersDetailsMinLength,
    "any.required": validationMessage.organizationMembersDetailsRequired,
  });
