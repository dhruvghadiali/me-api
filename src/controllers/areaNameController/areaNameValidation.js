const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  isActiveCityExists,
  checkValidObjectId,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  areaNameMaxChar,
  areaNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  cityIdBase,
  areaNameBase,
  areaNameEmpty,
  cityIdInvalid,
  areaNameIdBase,
  cityIdRequired,
  cityNameNotFound,
  areaNameRequired,
  areaNameNotFound,
  areaNameMaxLength,
  areaNameMinLength,
  areaNameIdInvalid,
  areaNameIdRequired,
  areaNameReqBodyBase,
  areaNameReqBodyEmpty,
  areaNameReqBodyUnknown,
  areaNameReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  city: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveCityExists)
    .required()
    .messages({
      "string.base": cityIdBase,
      "any.invalid": cityIdInvalid,
      "any.required": cityIdRequired,
      "any.notFound": cityNameNotFound,
    }),
  name: Joi.string()
    .trim()
    .min(areaNameMinChar)
    .max(areaNameMaxChar)
    .required()
    .messages({
      "string.base": areaNameBase,
      "string.empty": areaNameEmpty,
      "string.min": areaNameMinLength,
      "string.max": areaNameMaxLength,
      "any.required": areaNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": areaNameReqBodyBase,
    "object.empty": areaNameReqBodyEmpty,
    "object.unknown": areaNameReqBodyUnknown,
    "any.required": areaNameReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  city: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveCityExists)
    .messages({
      "string.base": cityIdBase,
      "any.invalid": cityIdInvalid,
      "any.notFound": cityNameNotFound,
    }),
  name: Joi.string().trim().min(areaNameMinChar).max(areaNameMaxChar).messages({
    "string.base": areaNameBase,
    "string.empty": areaNameEmpty,
    "string.min": areaNameMinLength,
    "string.max": areaNameMaxLength,
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": areaNameReqBodyBase,
    "object.empty": areaNameReqBodyEmpty,
    "object.unknown": areaNameReqBodyUnknown,
    "any.required": areaNameReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveAreaNameExists)
  .messages({
    "string.base": areaNameIdBase,
    "any.invalid": areaNameIdInvalid,
    "any.required": areaNameIdRequired,
    "any.notFound": areaNameNotFound,
  });

const validateAreaNamesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateAreaNamesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateAreaNamesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateAreaNamesPutReqBody,
  validateAreaNamesPostReqBody,
  validateAreaNamesQueryParams,
};
