const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveAdmissionDocumentExists,
} = require("@MEUtils/reqBodyValidator");
const {
  admissionDocumentMaxChar,
  admissionDocumentMinChar,
} = require("@MEHelpers/validationConst");
const {
  admissionDocumentBase,
  admissionDocumentEmpty,
  admissionDocumentIdBase,
  admissionDocumentNotFound,
  admissionDocumentRequired,
  admissionDocumentMinLength,
  admissionDocumentMaxLength,
  admissionDocumentIdInvalid,
  admissionDocumentIdRequired,
  admissionDocumentReqBodyBase,
  admissionDocumentReqBodyEmpty,
  admissionDocumentReqBodyUnknown,
  admissionDocumentReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  admission_document: Joi.string()
    .trim()
    .min(admissionDocumentMinChar)
    .max(admissionDocumentMaxChar)
    .required()
    .messages({
      "string.base": admissionDocumentBase,
      "string.empty": admissionDocumentEmpty,
      "string.min": admissionDocumentMinLength,
      "string.max": admissionDocumentMaxLength,
      "any.required": admissionDocumentRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": admissionDocumentReqBodyBase,
    "object.empty": admissionDocumentReqBodyEmpty,
    "object.unknown": admissionDocumentReqBodyUnknown,
    "any.required": admissionDocumentReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  admission_document: Joi.string()
    .trim()
    .min(admissionDocumentMinChar)
    .max(admissionDocumentMaxChar)
    .required()
    .messages({
      "string.base": admissionDocumentBase,
      "string.empty": admissionDocumentEmpty,
      "string.min": admissionDocumentMinLength,
      "string.max": admissionDocumentMaxLength,
      "any.required": admissionDocumentRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": admissionDocumentReqBodyBase,
    "object.empty": admissionDocumentReqBodyEmpty,
    "object.unknown": admissionDocumentReqBodyUnknown,
    "any.required": admissionDocumentReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveAdmissionDocumentExists)
  .messages({
    "string.base": admissionDocumentIdBase,
    "any.invalid": admissionDocumentIdInvalid,
    "any.required": admissionDocumentIdRequired,
    "any.notFound": admissionDocumentNotFound,
  });

const validateAdmissionDocumentsPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await postValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateAdmissionDocumentsPutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await putValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateAdmissionDocumentsQueryParams = asyncHandler(
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
  validateAdmissionDocumentsPutReqBody,
  validateAdmissionDocumentsPostReqBody,
  validateAdmissionDocumentsQueryParams,
};
