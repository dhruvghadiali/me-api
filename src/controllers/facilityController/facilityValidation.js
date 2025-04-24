const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveFacilityExists,
  isActiveFacilityTypeExists,
} = require("@MEUtils/reqBodyValidator");
const {
  facilityNameMaxChar,
  facilityNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  facilityIdBase,
  facilityNameBase,
  facilityIdInvalid,
  facilityNameEmpty,
  facilityIdRequired,
  facilityTypeIdBase,
  facilityReqBodyBase,
  facilityNameNotFound,
  facilityReqBodyEmpty,
  facilityNameRequired,
  facilityTypeNotFound,
  facilityNameMaxLength,
  facilityNameMinLength,
  facilityTypeIdInvalid,
  facilityTypeIdRequired,
  facilityReqBodyUnknown,
  facilityReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  facility_type: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveFacilityTypeExists)
    .required()
    .messages({
      "string.base": facilityTypeIdBase,
      "any.invalid": facilityTypeIdInvalid,
      "any.required": facilityTypeIdRequired,
      "any.notFound": facilityTypeNotFound,
    }),
  facility_name: Joi.string()
    .trim()
    .min(facilityNameMinChar)
    .max(facilityNameMaxChar)
    .required()
    .messages({
      "string.base": facilityNameBase,
      "string.empty": facilityNameEmpty,
      "string.min": facilityNameMinLength,
      "string.max": facilityNameMaxLength,
      "any.required": facilityNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": facilityReqBodyBase,
    "object.empty": facilityReqBodyEmpty,
    "object.unknown": facilityReqBodyUnknown,
    "any.required": facilityReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  facility_type: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveFacilityTypeExists)
    .required()
    .messages({
      "string.base": facilityTypeIdBase,
      "any.invalid": facilityTypeIdInvalid,
      "any.required": facilityTypeIdRequired,
      "any.notFound": facilityTypeNotFound,
    }),
  facility_name: Joi.string()
    .trim()
    .min(facilityNameMinChar)
    .max(facilityNameMaxChar)
    .required()
    .messages({
      "string.base": facilityNameBase,
      "string.empty": facilityNameEmpty,
      "string.min": facilityNameMinLength,
      "string.max": facilityNameMaxLength,
      "any.required": facilityNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": facilityReqBodyBase,
    "object.empty": facilityReqBodyEmpty,
    "object.unknown": facilityReqBodyUnknown,
    "any.required": facilityReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveFacilityExists)
  .messages({
    "string.base": facilityIdBase,
    "any.invalid": facilityIdInvalid,
    "any.required": facilityIdRequired,
    "any.notFound": facilityNameNotFound,
  });

const validateFacilitiesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateFacilitiesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateFacilitiesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateFacilitiesPostReqBody,
  validateFacilitiesPutReqBody,
  validateFacilitiesQueryParams,
};
