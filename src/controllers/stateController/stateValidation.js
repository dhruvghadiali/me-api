const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveStateExists,
} = require("@MEUtils/reqBodyValidator");
const {
  stateNameMaxChar,
  stateNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  stateIdBase,
  stateNameBase,
  stateNameEmpty,
  stateIdInvalid,
  stateIdRequired,
  stateReqBodyBase,
  stateReqBodyEmpty,
  stateNameRequired,
  stateNameNotFound,
  stateNameMaxLength,
  stateNameMinLength,
  stateReqBodyUnknown,
  stateReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(stateNameMinChar)
    .max(stateNameMaxChar)
    .required()
    .messages({
      "string.base": stateNameBase,
      "string.empty": stateNameEmpty,
      "string.min": stateNameMinLength,
      "string.max": stateNameMaxLength,
      "any.required": stateNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": stateReqBodyBase,
    "object.empty": stateReqBodyEmpty,
    "object.unknown": stateReqBodyUnknown,
    "any.required": stateReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(stateNameMinChar)
    .max(stateNameMaxChar)
    .required()
    .messages({
      "string.base": stateNameBase,
      "string.empty": stateNameEmpty,
      "string.min": stateNameMinLength,
      "string.max": stateNameMaxLength,
      "any.required": stateNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": stateReqBodyBase,
    "object.empty": stateReqBodyEmpty,
    "any.required": stateReqBodyRequired,
    "object.unknown": stateReqBodyUnknown,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveStateExists)
  .messages({
    "string.base": stateIdBase,
    "any.invalid": stateIdInvalid,
    "any.required": stateIdRequired,
    "any.notFound": stateNameNotFound,
  });

const validateStatesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateStatesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateStatesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateStatesPutReqBody,
  validateStatesPostReqBody,
  validateStatesQueryParams,
};
