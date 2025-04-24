const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveAcademicGradeExists,
} = require("@MEUtils/reqBodyValidator");
const {
  academicGradeMaxChar,
  academicGradeMinChar,
} = require("@MEHelpers/validationConst");
const {
  academicGradeBase,
  academicGradeEmpty,
  academicGradeIdBase,
  academicGradeNotFound,
  academicGradeRequired,
  academicGradeMaxLength,
  academicGradeMinLength,
  academicGradeIdInvalid,
  academicGradeIdRequired,
  academicGradeReqBodyBase,
  academicGradeReqBodyEmpty,
  academicGradeReqBodyUnknown,
  academicGradeReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  academic_grade: Joi.string()
    .trim()
    .min(academicGradeMinChar)
    .max(academicGradeMaxChar)
    .required()
    .messages({
      "string.base": academicGradeBase,
      "string.empty": academicGradeEmpty,
      "string.min": academicGradeMinLength,
      "string.max": academicGradeMaxLength,
      "any.required": academicGradeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": academicGradeReqBodyBase,
    "object.empty": academicGradeReqBodyEmpty,
    "object.unknown": academicGradeReqBodyUnknown,
    "any.required": academicGradeReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  academic_grade: Joi.string()
    .trim()
    .min(academicGradeMinChar)
    .max(academicGradeMaxChar)
    .required()
    .messages({
      "string.base": academicGradeBase,
      "string.empty": academicGradeEmpty,
      "string.min": academicGradeMinLength,
      "string.max": academicGradeMaxLength,
      "any.required": academicGradeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": academicGradeReqBodyBase,
    "object.empty": academicGradeReqBodyEmpty,
    "object.unknown": academicGradeReqBodyUnknown,
    "any.required": academicGradeReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveAcademicGradeExists)
  .messages({
    "string.base": academicGradeIdBase,
    "any.invalid": academicGradeIdInvalid,
    "any.required": academicGradeIdRequired,
    "any.notFound": academicGradeNotFound,
  });

const validateAcademicGradesPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await postValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateAcademicGradesPutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await putValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateAcademicGradesQueryParams = asyncHandler(
  async (req, res, next) => {
    try {
      await queryParamsValidationSchema.validateAsync(req.params.id);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

module.exports = {
  validateAcademicGradesPutReqBody,
  validateAcademicGradesPostReqBody,
  validateAcademicGradesQueryParams,
};
