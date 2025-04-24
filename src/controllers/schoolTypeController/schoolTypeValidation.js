const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveSchoolTypeExists,
} = require("@MEUtils/reqBodyValidator");
const {
  schoolTypeMaxChar,
  schoolTypeMinChar,
} = require("@MEHelpers/validationConst");
const {
  schoolTypeBase,
  schoolTypeEmpty,
  schoolTypeIdBase,
  schoolTypeNotFound,
  schoolTypeRequired,
  schoolTypeIdInvalid,
  schoolTypeMaxLength,
  schoolTypeMinLength,
  schoolTypeIdRequired,
  schoolTypeReqBodyBase,
  schoolTypeReqBodyEmpty,
  schoolTypeReqBodyUnknown,
  schoolTypeReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  school_type: Joi.string()
    .trim()
    .min(schoolTypeMinChar)
    .max(schoolTypeMaxChar)
    .required()
    .messages({
      "string.base": schoolTypeBase,
      "string.empty": schoolTypeEmpty,
      "string.min": schoolTypeMinLength,
      "string.max": schoolTypeMaxLength,
      "any.required": schoolTypeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolTypeReqBodyBase,
    "object.empty": schoolTypeReqBodyEmpty,
    "object.unknown": schoolTypeReqBodyUnknown,
    "any.required": schoolTypeReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  school_type: Joi.string()
    .trim()
    .min(schoolTypeMinChar)
    .max(schoolTypeMaxChar)
    .required()
    .messages({
      "string.base": schoolTypeBase,
      "string.empty": schoolTypeEmpty,
      "string.min": schoolTypeMinLength,
      "string.max": schoolTypeMaxLength,
      "any.required": schoolTypeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolTypeReqBodyBase,
    "object.empty": schoolTypeReqBodyEmpty,
    "object.unknown": schoolTypeReqBodyUnknown,
    "any.required": schoolTypeReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveSchoolTypeExists)
  .messages({
    "string.base": schoolTypeIdBase,
    "any.invalid": schoolTypeIdInvalid,
    "any.required": schoolTypeIdRequired,
    "any.notFound": schoolTypeNotFound,
  });

const validateSchoolTypesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateSchoolTypesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateSchoolTypesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateSchoolTypesPutReqBody,
  validateSchoolTypesPostReqBody,
  validateSchoolTypesQueryParams,
};
