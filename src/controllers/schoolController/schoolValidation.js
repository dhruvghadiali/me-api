const Joi = require("joi");
const moment = require("moment");

const ErrorResponse = require("@MEUtils/errorResponse");

const {
  organizationPostReqBodyValidationSchema,
} = require("@MEControllers/organizationController/organizationValidation");
const {
  organizationMembersPostReqBodyValidationSchema,
} = require("@MEControllers/organizationMemberController/organizationMemberValidation");
const {
  schoolAddressPostReqBodyValidationSchema,
} = require("@MEControllers/schoolAddressController/schoolAddressValidation");
const {
  schoolAdminPostReqBodyValidationSchema,
} = require("@MEControllers/schoolAdminAuthController/schoolAdminAuthValidation");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
const { emailRegex, phoneRegex } = require("@MEHelpers/regex");

const {
  checkValidObjectId,
  isActiveSchoolTypeExists,
  isActiveEducationBoardExists,
} = require("@MEUtils/reqBodyValidator");
const {
  emailMaxChar,
  emailMinChar,
  phoneNumberChar,
  schoolNameMaxChar,
  schoolNameMinChar,
  schoolShortNameMaxChar,
  schoolShortNameMinChar,
  schoolAffiliateNumberMaxChar,
  schoolAffiliateNumberMinChar,
  schoolEducationBoardsMaxLimit,
  schoolEducationBoardsMinLimit,
  schoolEstablishedYearMinNumber,
} = require("@MEHelpers/validationConst");

const {
  schoolAffiliateNumberEmpty,
  schoolAffiliateNumberRequired,
  schoolAffiliateNumberMinLength,
  schoolAffiliateNumberMaxLength,
  schoolAffiliateNumberInvalidFormate,
  schoolNameEmpty,
  schoolNameRequired,
  schoolNameMinLength,
  schoolNameMaxLength,
  schoolNameInvalidFormate,
  schoolShortNameEmpty,
  schoolShortNameRequired,
  schoolShortNameMinLength,
  schoolShortNameMaxLength,
  schoolShortNameInvalidFormate,
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
  schoolEstablishedYearMinYear,
  schoolEstablishedYearMaxYear,
  schoolEstablishedYearRequired,
  schoolEstablishedYearInvalidFormate,
  schoolEstablishedYearPositiveNumber,
  educationBoardInvalid,
  schoolEducationBoardsArray,
  schoolEducationBoardsUnique,
  schoolEducationBoardsRequired,
  schoolEducationBoardsMinLength,
  schoolEducationBoardsMaxLength,
  schoolTypeInvalid,
  schoolTypeRequired,
  schoolTypeNotFound,
  schoolDetailsEmpty,
  schoolDetailsRequired,
  schoolDetailsUnknownProperty,
  schoolDetailsMustBeObjectRequired,
} = require("@MEHelpers/validationMessage");

const currentYear = moment().year();

const schoolPostReqBodyValidationSchema = Joi.object({
  organization: organizationPostReqBodyValidationSchema,
  organization_members: organizationMembersPostReqBodyValidationSchema,
  school_addresses: schoolAddressPostReqBodyValidationSchema,
  school_admins: schoolAdminPostReqBodyValidationSchema,
  school: Joi.object({
    affiliate_number: Joi.string()
      .trim()
      .min(schoolAffiliateNumberMinChar)
      .max(schoolAffiliateNumberMaxChar)
      .required()
      .messages({
        "string.base": schoolAffiliateNumberInvalidFormate,
        "string.empty": schoolAffiliateNumberEmpty,
        "string.min": schoolAffiliateNumberMinLength,
        "string.max": schoolAffiliateNumberMaxLength,
        "any.required": schoolAffiliateNumberRequired,
      }),
    name: Joi.string()
      .trim()
      .min(schoolNameMinChar)
      .max(schoolNameMaxChar)
      .required()
      .messages({
        "string.base": schoolNameInvalidFormate,
        "string.empty": schoolNameEmpty,
        "string.min": schoolNameMinLength,
        "string.max": schoolNameMaxLength,
        "any.required": schoolNameRequired,
      }),
    short_name: Joi.string()
      .trim()
      .min(schoolShortNameMinChar)
      .max(schoolShortNameMaxChar)
      .required()
      .messages({
        "string.base": schoolShortNameInvalidFormate,
        "string.empty": schoolShortNameEmpty,
        "string.min": schoolShortNameMinLength,
        "string.max": schoolShortNameMaxLength,
        "any.required": schoolShortNameRequired,
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
    established_year: Joi.number()
      .integer()
      .min(schoolEstablishedYearMinNumber)
      .max(currentYear)
      .required()
      .messages({
        "number.base": schoolEstablishedYearInvalidFormate,
        "number.positive": schoolEstablishedYearPositiveNumber,
        "number.min": schoolEstablishedYearMinYear,
        "number.max": schoolEstablishedYearMaxYear,
        "any.required": schoolEstablishedYearRequired,
      }),
    education_boards: Joi.array()
      .items(
        Joi.string()
          .custom(checkValidObjectId)
          .messages({ "any.invalid": educationBoardInvalid })
      )
      .min(schoolEducationBoardsMinLimit)
      .max(schoolEducationBoardsMaxLimit)
      .required()
      .unique()
      .external(isActiveEducationBoardExists)
      .messages({
        "array.unique": schoolEducationBoardsUnique,
        "array.base": schoolEducationBoardsArray,
        "array.min": schoolEducationBoardsMinLength,
        "array.max": schoolEducationBoardsMaxLength,
        "any.required": schoolEducationBoardsRequired,
      }),
    school_type: Joi.string()
      .custom(checkValidObjectId)
      .external(isActiveSchoolTypeExists)
      .required()
      .messages({
        "any.required": schoolTypeRequired,
        "any.invalid": schoolTypeInvalid,
        "any.notFound": schoolTypeNotFound,
      }),
  }),
})
  .unknown(false)
  .required()
  .empty({})
  .messages({
    "object.unknown": schoolDetailsUnknownProperty,
    "object.base": schoolDetailsMustBeObjectRequired,
    "object.empty": schoolDetailsEmpty,
    "any.required": schoolDetailsRequired,
  });

const schoolPostReqBodyValidate = asyncHandler(async (req, res, next) => {
  try {
    await schoolPostReqBodyValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  schoolPostReqBodyValidate,
};
