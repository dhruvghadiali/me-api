const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveFeeTypeExists,
} = require("@MEUtils/reqBodyValidator");
const {
  feeTypeMaxChar,
  feeTypeMinChar,
} = require("@MEHelpers/validationConst");
const {
  feeTypeBase,
  feeTypeEmpty,
  feeTypeIdBase,
  feeTypeNotFound,
  feeTypeRequired,
  feeTypeIdInvalid,
  feeTypeMaxLength,
  feeTypeMinLength,
  feeTypeIdRequired,
  feeTypeReqBodyBase,
  feeTypeReqBodyEmpty,
  feeTypeReqBodyUnknown,
  feeTypeReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  fee_type: Joi.string()
    .trim()
    .min(feeTypeMinChar)
    .max(feeTypeMaxChar)
    .required()
    .messages({
      "string.base": feeTypeBase,
      "string.empty": feeTypeEmpty,
      "string.min": feeTypeMinLength,
      "string.max": feeTypeMaxLength,
      "any.required": feeTypeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": feeTypeReqBodyBase,
    "object.empty": feeTypeReqBodyEmpty,
    "object.unknown": feeTypeReqBodyUnknown,
    "any.required": feeTypeReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  fee_type: Joi.string()
    .trim()
    .min(feeTypeMinChar)
    .max(feeTypeMaxChar)
    .required()
    .messages({
      "string.base": feeTypeBase,
      "string.empty": feeTypeEmpty,
      "string.min": feeTypeMinLength,
      "string.max": feeTypeMaxLength,
      "any.required": feeTypeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": feeTypeReqBodyBase,
    "object.empty": feeTypeReqBodyEmpty,
    "object.unknown": feeTypeReqBodyUnknown,
    "any.required": feeTypeReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveFeeTypeExists)
  .messages({
    "string.base": feeTypeIdBase,
    "any.invalid": feeTypeIdInvalid,
    "any.required": feeTypeIdRequired,
    "any.notFound": feeTypeNotFound,
  });

const validateFeeTypesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateFeeTypesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateFeeTypesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateFeeTypesPutReqBody,
  validateFeeTypesPostReqBody,
  validateFeeTypesQueryParams,
};
