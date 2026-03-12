const Joi = require("joi");
const _ = require("lodash");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const { setValidationMessage } = require("@MEUtils/utility");
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
  lastNameMaxChar,
  lastNameMinChar,
  phoneNumberChar,
  firstNameMaxChar,
  firstNameMinChar,
  aadhaarNumberChar,
  organizationMemberPositionMaxChar,
  organizationMemberPositionMinChar,
  organizationMemberArrayMaxLength,
  organizationMemberArrayMinLength,
} = require("@MEHelpers/validationConst");
const {
  organizationMemberDetailsNameDuplicate,
  organizationMemberDetailsEmailDuplicate,
  organizationMemberDetailsPhoneNumberDuplicate,
  organizationMemberDetailsAadhaarNumberDuplicate,
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
  organizationMemberPositionEmpty,
  organizationMemberPositionRequired,
  organizationMemberPositionMinLength,
  organizationMemberPositionMaxLength,
  organizationMemberPositionInvalidFormate,
  aadhaarNumberEmpty,
  aadhaarNumberRequired,
  aadhaarNumberMinLength,
  aadhaarNumberMaxLength,
  aadhaarNumberInvalidFormate,
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
  organizationMemberDetailsEmpty,
  organizationMemberDetailsRequired,
  organizationMemberDetailsMustBeObject,
  organizationMemberDetailsUnknownProperty,
  organizationMembersDetailsMustBeArray,
  organizationMembersDetailsEmpty,
  organizationMembersDetailsMinLength,
  organizationMembersDetailsMaxLength,
  organizationMembersDetailsRequired,
} = require("@MEHelpers/validationMessage");

const checkDuplicateRecord = (value, helpers) => {
  const names = _.map(
    value,
    (member) => `${member.first_name} ${member.last_name}`,
  );
  const emails = _.map(value, "email");
  const phoneNumbers = _.map(value, "phone_number");
  const aadhaarNumbers = _.map(value, "aadhaar_number");

  if (_.size(_.uniq(names)) !== _.size(names)) {
    return helpers.message(organizationMemberDetailsNameDuplicate);
  }

  if (_.size(_.uniq(emails)) !== _.size(emails)) {
    return helpers.message(organizationMemberDetailsEmailDuplicate);
  }

  if (_.size(_.uniq(phoneNumbers)) !== _.size(phoneNumbers)) {
    return helpers.message(organizationMemberDetailsPhoneNumberDuplicate);
  }

  if (_.size(_.uniq(aadhaarNumbers)) !== _.size(aadhaarNumbers)) {
    return helpers.message(organizationMemberDetailsAadhaarNumberDuplicate);
  }

  return value;
};

const organizationMembersPostReqBodyValidationSchema = Joi.array()
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
      position: Joi.string()
        .trim()
        .lowercase()
        .min(organizationMemberPositionMinChar)
        .max(organizationMemberPositionMaxChar)
        .required()
        .messages({
          "string.base": organizationMemberPositionInvalidFormate,
          "string.empty": organizationMemberPositionEmpty,
          "string.min": organizationMemberPositionMinLength,
          "string.max": organizationMemberPositionMaxLength,
          "any.required": organizationMemberPositionRequired,
        }),
      aadhaar_number: Joi.string()
        .trim()
        .lowercase()
        .min(aadhaarNumberChar)
        .max(aadhaarNumberChar)
        .required()
        .messages({
          "string.base": aadhaarNumberInvalidFormate,
          "string.empty": aadhaarNumberEmpty,
          "string.min": aadhaarNumberMinLength,
          "string.max": aadhaarNumberMaxLength,
          "any.required": aadhaarNumberRequired,
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
        "any.required": organizationMemberDetailsRequired,
        "object.base": organizationMemberDetailsMustBeObject,
        "object.empty": organizationMemberDetailsEmpty,
        "object.unknown": organizationMemberDetailsUnknownProperty,
      }),
  )
  .min(organizationMemberArrayMinLength)
  .max(organizationMemberArrayMaxLength)
  .required()
  .custom(checkDuplicateRecord)
  .messages({
    "array.base": organizationMembersDetailsMustBeArray,
    "array.empty": organizationMembersDetailsEmpty,
    "array.min": organizationMembersDetailsMinLength,
    "array.max": organizationMembersDetailsMaxLength,
    "array.includesRequiredUnknowns": organizationMembersDetailsMinLength,
    "any.required": organizationMembersDetailsRequired,
  });

const validateAddOrganizationMembersPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await organizationMembersPostReqBodyValidationSchema.validateAsync(
        req.body,
      );
      next();
    } catch (err) {
      next(
        new ErrorResponse(
          setValidationMessage(err),
          HTTP_STATUS_CODES.STATUS_400,
        ),
      );
    }
  },
);

module.exports = {
  validateAddOrganizationMembersPostReqBody,
};
