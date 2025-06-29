const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  schoolAdmissionDocumentNotesMaxChar,
  schoolAdmissionDocumentNotesMinChar,
} = require("@MEHelpers/validationConst");
const {
  checkValidObjectId,
  isActiveAdmissionDocumentExists,
  isActiveSchoolAcademicClassExists,
  isActiveSchoolAdmissionDocumentExists,
} = require("@MEUtils/reqBodyValidator");
const {
  schoolAcademicClassIdBase,
  schoolAcademicClassIdEmpty,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
  schoolAcademicClassIdNotFound,
  admissionDocumentIdBase,
  admissionDocumentIdEmpty,
  admissionDocumentIdInvalid,
  admissionDocumentIdRequired,
  admissionDocumentIdNotFound,
  schoolAdmissionDocumentNotesBase,
  schoolAdmissionDocumentNotesEmpty,
  schoolAdmissionDocumentNotesMaxLength,
  schoolAdmissionDocumentNotesMinLength,
  schoolAdmissionDocumentReqBodyBase,
  schoolAdmissionDocumentReqBodyEmpty,
  schoolAdmissionDocumentReqBodyUnknown,
  schoolAdmissionDocumentReqBodyRequired,
  schoolAdmissionDocumentVerificationStatusBase,
  schoolAdmissionDocumentVerificationStatusRequired,
  schoolAdmissionDocumentIdBase,
  schoolAdmissionDocumentIdEmpty,
  schoolAdmissionDocumentNotFound,
  schoolAdmissionDocumentIdInvalid,
  schoolAdmissionDocumentIdRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  school_academic_class: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveSchoolAcademicClassExists)
    .messages({
      "string.empty": schoolAcademicClassIdEmpty,
      "string.base": schoolAcademicClassIdBase,
      "any.invalid": schoolAcademicClassIdInvalid,
      "any.required": schoolAcademicClassIdRequired,
      "any.notFound": schoolAcademicClassIdNotFound,
    }),
  admission_document: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveAdmissionDocumentExists)
    .messages({
      "string.empty": admissionDocumentIdEmpty,
      "string.base": admissionDocumentIdBase,
      "any.invalid": admissionDocumentIdInvalid,
      "any.required": admissionDocumentIdRequired,
      "any.notFound": admissionDocumentIdNotFound,
    }),
  notes: Joi.string()
    .trim()
    .max(schoolAdmissionDocumentNotesMaxChar)
    .min(schoolAdmissionDocumentNotesMinChar)
    .messages({
      "string.base": schoolAdmissionDocumentNotesBase,
      "string.empty": schoolAdmissionDocumentNotesEmpty,
      "string.min": schoolAdmissionDocumentNotesMinLength,
      "string.max": schoolAdmissionDocumentNotesMaxLength,
    }),
  is_required: Joi.boolean().required().messages({
    "any.required": schoolAdmissionDocumentVerificationStatusRequired,
    "boolean.base": schoolAdmissionDocumentVerificationStatusBase,
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolAdmissionDocumentReqBodyBase,
    "object.empty": schoolAdmissionDocumentReqBodyEmpty,
    "object.unknown": schoolAdmissionDocumentReqBodyUnknown,
    "any.required": schoolAdmissionDocumentReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  school_academic_class: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveSchoolAcademicClassExists)
    .messages({
      "string.empty": schoolAcademicClassIdEmpty,
      "string.base": schoolAcademicClassIdBase,
      "any.invalid": schoolAcademicClassIdInvalid,
      "any.required": schoolAcademicClassIdRequired,
      "any.notFound": schoolAcademicClassIdNotFound,
    }),
  admission_document: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveAdmissionDocumentExists)
    .messages({
      "string.empty": admissionDocumentIdEmpty,
      "string.base": admissionDocumentIdBase,
      "any.invalid": admissionDocumentIdInvalid,
      "any.required": admissionDocumentIdRequired,
      "any.notFound": admissionDocumentIdNotFound,
    }),
  notes: Joi.string()
    .trim()
    .max(schoolAdmissionDocumentNotesMaxChar)
    .min(schoolAdmissionDocumentNotesMinChar)
    .messages({
      "string.base": schoolAdmissionDocumentNotesBase,
      "string.empty": schoolAdmissionDocumentNotesEmpty,
      "string.min": schoolAdmissionDocumentNotesMinLength,
      "string.max": schoolAdmissionDocumentNotesMaxLength,
    }),
  is_required: Joi.boolean().required().messages({
    "any.required": schoolAdmissionDocumentVerificationStatusRequired,
    "boolean.base": schoolAdmissionDocumentVerificationStatusBase,
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolAdmissionDocumentReqBodyBase,
    "object.empty": schoolAdmissionDocumentReqBodyEmpty,
    "object.unknown": schoolAdmissionDocumentReqBodyUnknown,
    "any.required": schoolAdmissionDocumentReqBodyRequired,
  });

const schoolAcademicClassQueryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveSchoolAcademicClassExists)
  .messages({
    "string.base": schoolAcademicClassIdBase,
    "string.empty": schoolAcademicClassIdEmpty,
    "any.invalid": schoolAcademicClassIdInvalid,
    "any.required": schoolAcademicClassIdRequired,
    "any.notFound": schoolAcademicClassIdNotFound,
  });

const schoolAdmissionDocumentQueryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveSchoolAdmissionDocumentExists)
  .messages({
    "string.empty": schoolAdmissionDocumentIdEmpty,
    "string.base": schoolAdmissionDocumentIdBase,
    "any.invalid": schoolAdmissionDocumentIdInvalid,
    "any.required": schoolAdmissionDocumentIdRequired,
    "any.notFound": schoolAdmissionDocumentNotFound,
  });

const validateSchoolAdmissionDocumentPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await postValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolAdmissionDocumentPutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await putValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolAdmissionDocumentAcademicClassQueryParams = asyncHandler(
  async (req, res, next) => {
    try {
      await schoolAcademicClassQueryParamsValidationSchema.validateAsync(
        req.params.school_academic_class
      );
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolAdmissionDocumentQueryParams = asyncHandler(
  async (req, res, next) => {
    try {
      await schoolAdmissionDocumentQueryParamsValidationSchema.validateAsync(
        req.params.id
      );
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

module.exports = {
  validateSchoolAdmissionDocumentPostReqBody,
  validateSchoolAdmissionDocumentPutReqBody,
  validateSchoolAdmissionDocumentQueryParams,
  validateSchoolAdmissionDocumentAcademicClassQueryParams,
};
