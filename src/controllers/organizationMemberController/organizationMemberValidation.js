const Joi = require("joi");

const validationMessage = require("@MEHelpers/validationMessage");

const {
  emailRegex,
  phoneRegex,
  isCityExists,
  isStateExists,
  isZipcodeExists,
  isDistrictExists,
  isAreaNameExists,
  checkValidObjectId,
} = require("@MEUtils/utility");
const {
  emailMaxLength,
  emailMinLength,
  addressMinLength,
  addressMaxLength,
  phoneNumberLength,
  lastNameMinLength,
  lastNameMaxLength,
  firstNameMinLength,
  firstNameMaxLength,
  aadhaarNumberLength,
  organizationMembersDetailsMinLength,
  organizationMembersDetailsMaxLength,
  organizationMemberPositionMinLength,
  organizationMemberPositionMaxLength,
} = require("@MEHelpers/validationConst");

const checkDuplicateRecord = (value, helpers) => {
  const names = value.map(
    (member) => `${member.first_name} ${member.last_name}`
  );
  const emails = value.map((member) => member.email);
  const phoneNumbers = value.map((member) => member.phone_number);
  const aadhaarNumbers = value.map((member) => member.aadhaar_number);

  const nameDuplicates = names.filter(
    (name, index) => names.indexOf(name) !== index
  );
  const emailDuplicates = emails.filter(
    (email, index) => emails.indexOf(email) !== index
  );
  const phoneNumberDuplicates = phoneNumbers.filter(
    (phoneNumber, index) => phoneNumbers.indexOf(phoneNumber) !== index
  );
  const aadhaarNumberDuplicates = aadhaarNumbers.filter(
    (aadhaarNumber, index) => aadhaarNumbers.indexOf(aadhaarNumber) !== index
  );

  if (nameDuplicates.length > 0) {
    return helpers.message(
      validationMessage.organizationMemberDetailsNameDuplicate
    );
  }

  if (emailDuplicates.length > 0) {
    return helpers.message(
      validationMessage.organizationMemberDetailsEmailDuplicate
    );
  }

  if (phoneNumberDuplicates.length > 0) {
    return helpers.message(
      validationMessage.organizationMemberDetailsPhoneNumberDuplicate
    );
  }

  if (aadhaarNumberDuplicates.length > 0) {
    return helpers.message(
      validationMessage.organizationMemberDetailsAadhaarNumberDuplicate
    );
  }

  return value;
};

exports.postOrganizationMembersReqBodyValidationSchema = Joi.array()
  .items(
    Joi.object({
      first_name: Joi.string()
        .trim()
        .min(firstNameMinLength)
        .max(firstNameMaxLength)
        .required()
        .messages({
          "string.base": validationMessage.firstNameInvalidFormate,
          "string.empty": validationMessage.firstNameEmpty,
          "string.min": validationMessage.firstNameMinLength,
          "string.max": validationMessage.firstNameMaxLength,
          "any.required": validationMessage.firstNameRequired,
        }),
      last_name: Joi.string()
        .trim()
        .min(lastNameMinLength)
        .max(lastNameMaxLength)
        .required()
        .messages({
          "string.base": validationMessage.lastNameInvalidFormate,
          "string.empty": validationMessage.lastNameEmpty,
          "string.min": validationMessage.lastNameMinLength,
          "string.max": validationMessage.lastNameMaxLength,
          "any.required": validationMessage.lastNameRequired,
        }),
      email: Joi.string()
        .trim()
        .pattern(emailRegex)
        .min(emailMinLength)
        .max(emailMaxLength)
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
        .min(phoneNumberLength)
        .max(phoneNumberLength)
        .required()
        .messages({
          "string.base": validationMessage.phoneNumberInvalidFormate,
          "string.empty": validationMessage.phoneNumberEmpty,
          "string.pattern.base": validationMessage.phoneNumberInvalid,
          "string.min": validationMessage.phoneNumberMinLength,
          "string.max": validationMessage.phoneNumberMaxLength,
          "any.required": validationMessage.phoneNumberRequired,
        }),
      position: Joi.string()
        .trim()
        .lowercase()
        .min(organizationMemberPositionMinLength)
        .max(organizationMemberPositionMaxLength)
        .required()
        .messages({
          "string.base":
            validationMessage.organizationMemberPositionInvalidFormate,
          "string.empty": validationMessage.organizationMemberPositionEmpty,
          "string.min": validationMessage.organizationMemberPositionMinLength,
          "string.max": validationMessage.organizationMemberPositionMaxLength,
          "any.required": validationMessage.organizationMemberPositionRequired,
        }),
      aadhaar_number: Joi.string()
        .trim()
        .lowercase()
        .min(aadhaarNumberLength)
        .max(aadhaarNumberLength)
        .required()
        .messages({
          "string.base": validationMessage.aadhaarNumberInvalidFormate,
          "string.empty": validationMessage.aadhaarNumberEmpty,
          "string.min": validationMessage.aadhaarNumberMinLength,
          "string.max": validationMessage.aadhaarNumberMaxLength,
          "any.required": validationMessage.aadhaarNumberRequired,
        }),
      address: Joi.string()
        .trim()
        .lowercase()
        .min(addressMinLength)
        .max(addressMaxLength)
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
  .min(organizationMembersDetailsMinLength)
  .max(organizationMembersDetailsMaxLength)
  .required()
  .custom(checkDuplicateRecord)
  .messages({
    "array.base": validationMessage.organizationMembersDetailsMustBeArray,
    "array.empty": validationMessage.organizationMembersDetailsEmpty,
    "array.min": validationMessage.organizationMembersDetailsMinLength,
    "array.max": validationMessage.organizationMembersDetailsMaxLength,
    "array.includesRequiredUnknowns":
      validationMessage.organizationMembersDetailsMinLength,
    "any.required": validationMessage.organizationMembersDetailsRequired,
  });

exports.putOrganizationMembersReqBodyValidationSchema = Joi.array()
  .items(
    Joi.object({
      first_name: Joi.string()
        .trim()
        .min(firstNameMinLength)
        .max(firstNameMaxLength)
        .messages({
          "string.base": validationMessage.firstNameInvalidFormate,
          "string.empty": validationMessage.firstNameEmpty,
          "string.min": validationMessage.firstNameMinLength,
          "string.max": validationMessage.firstNameMaxLength,
        }),
      last_name: Joi.string()
        .trim()
        .min(lastNameMinLength)
        .max(lastNameMaxLength)
        .messages({
          "string.base": validationMessage.lastNameInvalidFormate,
          "string.empty": validationMessage.lastNameEmpty,
          "string.min": validationMessage.lastNameMinLength,
          "string.max": validationMessage.lastNameMaxLength,
        }),
      email: Joi.string()
        .trim()
        .pattern(emailRegex)
        .min(emailMinLength)
        .max(emailMaxLength)
        .messages({
          "string.base": validationMessage.emailInvalidFormate,
          "string.empty": validationMessage.emailEmpty,
          "string.pattern.base": validationMessage.emailInvalid,
          "string.min": validationMessage.emailMinLength,
          "string.max": validationMessage.emailMaxLength,
        }),
      phone_number: Joi.string()
        .trim()
        .pattern(phoneRegex)
        .min(phoneNumberLength)
        .max(phoneNumberLength)
        .messages({
          "string.base": validationMessage.phoneNumberInvalidFormate,
          "string.empty": validationMessage.phoneNumberEmpty,
          "string.pattern.base": validationMessage.phoneNumberInvalid,
          "string.min": validationMessage.phoneNumberMinLength,
          "string.max": validationMessage.phoneNumberMaxLength,
        }),
      position: Joi.string()
        .trim()
        .lowercase()
        .min(organizationMemberPositionMinLength)
        .max(organizationMemberPositionMaxLength)
        .messages({
          "string.base":
            validationMessage.organizationMemberPositionInvalidFormate,
          "string.empty": validationMessage.organizationMemberPositionEmpty,
          "string.min": validationMessage.organizationMemberPositionMinLength,
          "string.max": validationMessage.organizationMemberPositionMaxLength,
        }),
      aadhaar_number: Joi.string()
        .trim()
        .lowercase()
        .min(aadhaarNumberLength)
        .max(aadhaarNumberLength)
        .messages({
          "string.base": validationMessage.aadhaarNumberInvalidFormate,
          "string.empty": validationMessage.aadhaarNumberEmpty,
          "string.min": validationMessage.aadhaarNumberMinLength,
          "string.max": validationMessage.aadhaarNumberMaxLength,
        }),
      address: Joi.string()
        .trim()
        .lowercase()
        .min(addressMinLength)
        .max(addressMaxLength)
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
  .min(organizationMembersDetailsMinLength)
  .max(organizationMembersDetailsMaxLength)
  .required()
  .custom(checkDuplicateRecord)
  .messages({
    "array.base": validationMessage.organizationMembersDetailsMustBeArray,
    "array.empty": validationMessage.organizationMembersDetailsEmpty,
    "array.min": validationMessage.organizationMembersDetailsMinLength,
    "array.max": validationMessage.organizationMembersDetailsMaxLength,
    "array.includesRequiredUnknowns":
      validationMessage.organizationMembersDetailsMinLength,
    "any.required": validationMessage.organizationMembersDetailsRequired,
  });
