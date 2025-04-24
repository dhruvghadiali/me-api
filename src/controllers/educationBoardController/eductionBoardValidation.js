const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveEducationBoardExists,
} = require("@MEUtils/reqBodyValidator");
const {
  educationBoardMaxChar,
  educationBoardMinChar,
} = require("@MEHelpers/validationConst");
const {
  educationBoardBase,
  educationBoardEmpty,
  educationBoardIdBase,
  educationBoardNotFound,
  educationBoardRequired,
  educationBoardMaxLength,
  educationBoardMinLength,
  educationBoardIdInvalid,
  educationBoardIdRequired,
  educationBoardReqBodyBase,
  educationBoardReqBodyEmpty,
  educationBoardReqBodyUnknown,
  educationBoardReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  education_board: Joi.string()
    .trim()
    .min(educationBoardMinChar)
    .max(educationBoardMaxChar)
    .required()
    .messages({
      "string.base": educationBoardBase,
      "string.empty": educationBoardEmpty,
      "string.min": educationBoardMinLength,
      "string.max": educationBoardMaxLength,
      "any.required": educationBoardRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": educationBoardReqBodyBase,
    "object.empty": educationBoardReqBodyEmpty,
    "object.unknown": educationBoardReqBodyUnknown,
    "any.required": educationBoardReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  education_board: Joi.string()
    .trim()
    .min(educationBoardMinChar)
    .max(educationBoardMaxChar)
    .required()
    .messages({
      "string.base": educationBoardBase,
      "string.empty": educationBoardEmpty,
      "string.min": educationBoardMinLength,
      "string.max": educationBoardMaxLength,
      "any.required": educationBoardRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": educationBoardReqBodyBase,
    "object.empty": educationBoardReqBodyEmpty,
    "object.unknown": educationBoardReqBodyUnknown,
    "any.required": educationBoardReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveEducationBoardExists)
  .messages({
    "string.base": educationBoardIdBase,
    "any.invalid": educationBoardIdInvalid,
    "any.required": educationBoardIdRequired,
    "any.notFound": educationBoardNotFound,
  });

const validateEducationBoardsPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await postValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateEducationBoardsPutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await putValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateEducationBoardsQueryParams = asyncHandler(
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
  validateEducationBoardsPutReqBody,
  validateEducationBoardsPostReqBody,
  validateEducationBoardsQueryParams,
};
