const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveAcademicClassExists,
} = require("@MEUtils/reqBodyValidator");
const {
  academicClassMaxChar,
  academicClassMinChar,
} = require("@MEHelpers/validationConst");
const {
  academicClassBase,
  academicClassEmpty,
  academicClassIdBase,
  academicClassNotFound,
  academicClassRequired,
  academicClassMaxLength,
  academicClassMinLength,
  academicClassIdInvalid,
  academicClassIdRequired,
  academicClassReqBodyBase,
  academicClassReqBodyEmpty,
  academicClassReqBodyUnknown,
  academicClassReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  academic_class: Joi.string()
    .trim()
    .min(academicClassMinChar)
    .max(academicClassMaxChar)
    .required()
    .messages({
      "string.base": academicClassBase,
      "string.empty": academicClassEmpty,
      "string.min": academicClassMinLength,
      "string.max": academicClassMaxLength,
      "any.required": academicClassRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": academicClassReqBodyBase,
    "object.empty": academicClassReqBodyEmpty,
    "object.unknown": academicClassReqBodyUnknown,
    "any.required": academicClassReqBodyRequired,
  });

const validationPutSchema = Joi.object({
  academic_class: Joi.string()
    .trim()
    .min(academicClassMinChar)
    .max(academicClassMaxChar)
    .required()
    .messages({
      "string.base": academicClassBase,
      "string.empty": academicClassEmpty,
      "string.min": academicClassMinLength,
      "string.max": academicClassMaxLength,
      "any.required": academicClassRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": academicClassReqBodyBase,
    "object.empty": academicClassReqBodyEmpty,
    "object.unknown": academicClassReqBodyUnknown,
    "any.required": academicClassReqBodyRequired,
  });

const validationQueryParamsSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveAcademicClassExists)
  .messages({
    "string.base": academicClassIdBase,
    "any.invalid": academicClassIdInvalid,
    "any.required": academicClassIdRequired,
    "any.notFound": academicClassNotFound,
  });

const validateAcademicClassPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateAcademicClassPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await validationPutSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateAcademicClassQueryParams = asyncHandler(
  async (req, res, next) => {
    try {
      await validationQueryParamsSchema.validateAsync(req.params.id);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

module.exports = {
  validateAcademicClassPutReqBody,
  validateAcademicClassPostReqBody,
  validateAcademicClassQueryParams,
};
