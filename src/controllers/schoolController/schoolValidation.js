const Joi = require("joi");
const moment = require("moment");

const ErrorResponse = require("@MEUtils/errorResponse");
const validationMessage = require("@MEHelpers/validationMessage");
const validationConst = require("@MEHelpers/validationConst");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  setValidationMessage,
  emailRegex,
  phoneRegex,
  youtubeURLRegex,
  facebookURLRegex,
  instagramURLRegex,
} = require("@MEUtils/utility");

const {
  isSchoolTypeExists,
  checkValidObjectId,
  isEducationBoardsExists,
} = require("@MEUtils/reqBodyValidator");
const {
  postOrganizationReqBodyValidationSchema,
} = require("@MEControllers/organizationController/organizationValidation");
const {
  postOrganizationMembersReqBodyValidationSchema,
} = require("@MEControllers/organizationMemberController/organizationMemberValidation");
const {
  postSchoolAddressReqBodyValidationSchema,
} = require("@MEControllers/schoolAddressController/schoolAddressValidation");

const currentYear = moment().year();

const postSchoolReqBodyValidationSchema = Joi.object({
  organization: postOrganizationReqBodyValidationSchema,
  organization_members: postOrganizationMembersReqBodyValidationSchema,
  school_address: postSchoolAddressReqBodyValidationSchema,
  name: Joi.string()
    .trim()
    .min(validationConst.schoolNameMinLength)
    .max(validationConst.schoolNameMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.schoolNameInvalidFormate,
      "string.empty": validationMessage.schoolNameEmpty,
      "string.min": validationMessage.schoolNameMinLength,
      "string.max": validationMessage.schoolNameMaxLength,
      "any.required": validationMessage.schoolNameRequired,
    }),
  short_name: Joi.string()
    .trim()
    .min(validationConst.schoolShortNameMinLength)
    .max(validationConst.schoolShortNameMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.schoolShortNameInvalidFormate,
      "string.empty": validationMessage.schoolShortNameEmpty,
      "string.min": validationMessage.schoolShortNameMinLength,
      "string.max": validationMessage.schoolShortNameMaxLength,
      "any.required": validationMessage.schoolShortNameRequired,
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
  established_year: Joi.number()
    .integer()
    .min(validationConst.schoolEstablishedYearMinNumber)
    .max(currentYear)
    .required()
    .messages({
      "number.base": validationMessage.schoolEstablishedYearInvalidFormate,
      "number.positive": validationMessage.schoolEstablishedYearPositiveNumber,
      "number.min": validationMessage.schoolEstablishedYearMinYear,
      "number.max": validationMessage.schoolEstablishedYearMaxYear,
      "any.required": validationMessage.schoolEstablishedYearRequired,
    }),
  affiliate_number: Joi.string()
    .trim()
    .min(validationConst.schoolAffiliateNumberMinLength)
    .max(validationConst.schoolAffiliateNumberMaxLength)
    .required()
    .messages({
      "string.base": validationMessage.schoolAffiliateNumberInvalidFormate,
      "string.empty": validationMessage.schoolAffiliateNumberEmpty,
      "string.min": validationMessage.schoolAffiliateNumberMinLength,
      "string.max": validationMessage.schoolAffiliateNumberMaxLength,
      "any.required": validationMessage.schoolAffiliateNumberRequired,
    }),
  education_boards: Joi.array()
    .items(
      Joi.string()
        .custom(checkValidObjectId)
        .messages({ "any.invalid": validationMessage.educationBoardInvalid })
    )
    .min(validationConst.schoolEducationBoardsMaxLength)
    .max(validationConst.schoolEducationBoardsMinLength)
    .required()
    .unique()
    .external(isEducationBoardsExists)
    .messages({
      "array.unique": validationMessage.schoolEducationBoardsUnique,
      "array.base": validationMessage.schoolEducationBoardsArray,
      "array.min": validationMessage.schoolEducationBoardsMinLength,
      "array.max": validationMessage.schoolEducationBoardsMaxLength,
      "any.required": validationMessage.schoolEducationBoardsRequired,
    }),
  school_type: Joi.string()
    .custom(checkValidObjectId)
    .external(isSchoolTypeExists)
    .required()
    .messages({
      "any.required": validationMessage.schoolTypeRequired,
      "any.invalid": validationMessage.schoolTypeInvalid,
      "any.notFound": validationMessage.schoolTypeNotFound,
    }),
  // logo: Joi.string()
  //   .trim()
  //   .pattern(phoneRegex)
  //   .min(phoneNumberLength)
  //   .max(phoneNumberLength)
  //   .required()
  //   .messages({
  //     "string.base": validationMessage.phoneNumberInvalidFormate,
  //     "string.empty": validationMessage.phoneNumberEmpty,
  //     "string.pattern.base": validationMessage.phoneNumberInvalid,
  //     "string.min": validationMessage.phoneNumberMinLength,
  //     "string.max": validationMessage.phoneNumberMaxLength,
  //     "any.required": validationMessage.phoneNumberRequired,
  //   }),
  website: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .messages({
      "string.base": validationMessage.schoolWebsiteInvalidFormate,
      "string.empty": validationMessage.schoolWebsiteEmpty,
      "string.uri": validationMessage.schoolWebsiteURL,
    }),
  youtube: Joi.string().trim().pattern(youtubeURLRegex).messages({
    "string.base": validationMessage.youtubeURLInvalidFormate,
    "string.empty": validationMessage.youtubeURLEmpty,
    "string.pattern.base": validationMessage.youtubeURLPattern,
  }),
  instagram: Joi.string().trim().pattern(instagramURLRegex).messages({
    "string.base": validationMessage.instagramURLInvalidFormate,
    "string.empty": validationMessage.instagramURLEmpty,
    "string.pattern.base": validationMessage.instagramURLPattern,
  }),
  facebook: Joi.string().trim().pattern(facebookURLRegex).messages({
    "string.base": validationMessage.facebookURLInvalidFormate,
    "string.empty": validationMessage.facebookURLEmpty,
    "string.pattern.base": validationMessage.facebookURLPattern,
  }),
})
  .unknown(false)
  .required()
  .empty({})
  .messages({
    "object.unknown": validationMessage.schoolDetailsUnknownProperty,
    "object.base": validationMessage.schoolDetailsMustBeObjectRequired,
    "object.empty": validationMessage.schoolDetailsEmpty,
    "any.required": validationMessage.schoolDetailsRequired,
  });

exports.validateSchoolReqBody = asyncHandler(async (req, res, next) => {
  try {
    const validated = await postSchoolReqBodyValidationSchema.validateAsync(
      req.body
    );
    console.log("validated", validated);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});
