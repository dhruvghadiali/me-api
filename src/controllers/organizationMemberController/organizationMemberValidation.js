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
    return helpers.message(organizationMemberDetailsNameDuplicate);
  }

  if (emailDuplicates.length > 0) {
    return helpers.message(organizationMemberDetailsEmailDuplicate);
  }

  if (phoneNumberDuplicates.length > 0) {
    return helpers.message(organizationMemberDetailsPhoneNumberDuplicate);
  }

  if (aadhaarNumberDuplicates.length > 0) {
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
      })
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

// exports.putOrganizationMembersReqBodyValidationSchema = Joi.array()
//   .items(
//     Joi.object({
//       first_name: Joi.string()
//         .trim()
//         .min(validationConst.firstNameMinLength)
//         .max(validationConst.firstNameMaxLength)
//         .messages({
//           "string.base": validationMessage.firstNameInvalidFormate,
//           "string.empty": validationMessage.firstNameEmpty,
//           "string.min": validationMessage.firstNameMinLength,
//           "string.max": validationMessage.firstNameMaxLength,
//         }),
//       last_name: Joi.string()
//         .trim()
//         .min(validationConst.lastNameMinLength)
//         .max(validationConst.lastNameMaxLength)
//         .messages({
//           "string.base": validationMessage.lastNameInvalidFormate,
//           "string.empty": validationMessage.lastNameEmpty,
//           "string.min": validationMessage.lastNameMinLength,
//           "string.max": validationMessage.lastNameMaxLength,
//         }),
//       email: Joi.string()
//         .trim()
//         .pattern(emailRegex)
//         .min(validationConst.emailMinLength)
//         .max(validationConst.emailMaxLength)
//         .messages({
//           "string.base": validationMessage.emailInvalidFormate,
//           "string.empty": validationMessage.emailEmpty,
//           "string.pattern.base": validationMessage.emailInvalid,
//           "string.min": validationMessage.emailMinLength,
//           "string.max": validationMessage.emailMaxLength,
//         }),
//       phone_number: Joi.string()
//         .trim()
//         .pattern(phoneRegex)
//         .min(validationConst.phoneNumberLength)
//         .max(validationConst.phoneNumberLength)
//         .messages({
//           "string.base": validationMessage.phoneNumberInvalidFormate,
//           "string.empty": validationMessage.phoneNumberEmpty,
//           "string.pattern.base": validationMessage.phoneNumberInvalid,
//           "string.min": validationMessage.phoneNumberMinLength,
//           "string.max": validationMessage.phoneNumberMaxLength,
//         }),
//       position: Joi.string()
//         .trim()
//         .lowercase()
//         .min(validationConst.organizationMemberPositionMinLength)
//         .max(validationConst.organizationMemberPositionMaxLength)
//         .messages({
//           "string.base":
//             validationMessage.organizationMemberPositionInvalidFormate,
//           "string.empty": validationMessage.organizationMemberPositionEmpty,
//           "string.min": validationMessage.organizationMemberPositionMinLength,
//           "string.max": validationMessage.organizationMemberPositionMaxLength,
//         }),
//       aadhaar_number: Joi.string()
//         .trim()
//         .lowercase()
//         .min(validationConst.aadhaarNumberLength)
//         .max(validationConst.aadhaarNumberLength)
//         .messages({
//           "string.base": validationMessage.aadhaarNumberInvalidFormate,
//           "string.empty": validationMessage.aadhaarNumberEmpty,
//           "string.min": validationMessage.aadhaarNumberMinLength,
//           "string.max": validationMessage.aadhaarNumberMaxLength,
//         }),
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
//   .custom(checkDuplicateRecord)
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
  organizationMembersPostReqBodyValidationSchema,
  // putOrganizationMembersReqBodyValidationSchema,
};
