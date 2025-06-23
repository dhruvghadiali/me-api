const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
const { maxFeeAmount, minFeeAmount } = require("@MEHelpers/validationConst");

const {
  checkValidObjectId,
  isActiveFeeTypeExists,
  isActiveSchoolFeeExists,
  isActiveSchoolAcademicClassExists,
} = require("@MEUtils/reqBodyValidator");
const {
  schoolAcademicClassIdBase,
  schoolAcademicClassIdEmpty,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
  schoolAcademicClassIdNotFound,
  feeTypeIdBase,
  feeTypeIdEmpty,
  feeTypeIdInvalid,
  feeTypeIdRequired,
  feeTypeIdNotFound,
  monthlyFeeRequired,
  monthlyFeeMinAmount,
  monthlyFeeMaxAmount,
  monthlyFeeInvalidFormate,
  monthlyFeePositiveNumber,
  quarterlyFeeRequired,
  quarterlyFeeMinAmount,
  quarterlyFeeMaxAmount,
  quarterlyFeeInvalidFormate,
  quarterlyFeePositiveNumber,
  halfYearlyFeeRequired,
  halfYearlyFeeMinAmount,
  halfYearlyFeeMaxAmount,
  halfYearlyFeeInvalidFormate,
  halfYearlyFeePositiveNumber,
  yearlyFeeRequired,
  yearlyFeeMinAmount,
  yearlyFeeMaxAmount,
  yearlyFeeInvalidFormate,
  yearlyFeePositiveNumber,
  schoolFeeReqBodyEmpty,
  schoolFeeReqBodyBase,
  schoolFeeReqBodyUnknown,
  schoolFeeReqBodyRequired,
  schoolFeeIdBase,
  schoolFeeIdEmpty,
  schoolFeeIdInvalid,
  schoolFeeIdNotFound,
  schoolFeeIdRequired,
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
  fee_type: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveFeeTypeExists)
    .messages({
      "string.empty": feeTypeIdEmpty,
      "string.base": feeTypeIdBase,
      "any.invalid": feeTypeIdInvalid,
      "any.required": feeTypeIdRequired,
      "any.notFound": feeTypeIdNotFound,
    }),
  monthly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": monthlyFeeInvalidFormate,
      "number.positive": monthlyFeePositiveNumber,
      "number.min": monthlyFeeMinAmount,
      "number.max": monthlyFeeMaxAmount,
      "any.required": monthlyFeeRequired,
    }),
  quarterly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": quarterlyFeeInvalidFormate,
      "number.positive": quarterlyFeePositiveNumber,
      "number.min": quarterlyFeeMinAmount,
      "number.max": quarterlyFeeMaxAmount,
      "any.required": quarterlyFeeRequired,
    }),
  half_yearly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": halfYearlyFeeInvalidFormate,
      "number.positive": halfYearlyFeePositiveNumber,
      "number.min": halfYearlyFeeMinAmount,
      "number.max": halfYearlyFeeMaxAmount,
      "any.required": halfYearlyFeeRequired,
    }),
  yearly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": yearlyFeeInvalidFormate,
      "number.positive": yearlyFeePositiveNumber,
      "number.min": yearlyFeeMinAmount,
      "number.max": yearlyFeeMaxAmount,
      "any.required": yearlyFeeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolFeeReqBodyBase,
    "object.empty": schoolFeeReqBodyEmpty,
    "object.unknown": schoolFeeReqBodyUnknown,
    "any.required": schoolFeeReqBodyRequired,
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
  fee_type: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveFeeTypeExists)
    .messages({
      "string.empty": feeTypeIdEmpty,
      "string.base": feeTypeIdBase,
      "any.invalid": feeTypeIdInvalid,
      "any.required": feeTypeIdRequired,
      "any.notFound": feeTypeIdNotFound,
    }),
  monthly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": monthlyFeeInvalidFormate,
      "number.positive": monthlyFeePositiveNumber,
      "number.min": monthlyFeeMinAmount,
      "number.max": monthlyFeeMaxAmount,
      "any.required": monthlyFeeRequired,
    }),
  quarterly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": quarterlyFeeInvalidFormate,
      "number.positive": quarterlyFeePositiveNumber,
      "number.min": quarterlyFeeMinAmount,
      "number.max": quarterlyFeeMaxAmount,
      "any.required": quarterlyFeeRequired,
    }),
  half_yearly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": halfYearlyFeeInvalidFormate,
      "number.positive": halfYearlyFeePositiveNumber,
      "number.min": halfYearlyFeeMinAmount,
      "number.max": halfYearlyFeeMaxAmount,
      "any.required": halfYearlyFeeRequired,
    }),
  yearly_fee: Joi.number()
    .integer()
    .min(minFeeAmount)
    .max(maxFeeAmount)
    .required()
    .messages({
      "number.base": yearlyFeeInvalidFormate,
      "number.positive": yearlyFeePositiveNumber,
      "number.min": yearlyFeeMinAmount,
      "number.max": yearlyFeeMaxAmount,
      "any.required": yearlyFeeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolFeeReqBodyBase,
    "object.empty": schoolFeeReqBodyEmpty,
    "object.unknown": schoolFeeReqBodyUnknown,
    "any.required": schoolFeeReqBodyRequired,
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

const schoolFeeQueryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveSchoolFeeExists)
  .messages({
    "string.empty": schoolFeeIdEmpty,
    "string.base": schoolFeeIdBase,
    "any.invalid": schoolFeeIdInvalid,
    "any.required": schoolFeeIdRequired,
    "any.notFound": schoolFeeIdNotFound,
  });

const validateSchoolFeesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateSchoolFeesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateSchoolFeesAcademicClassQueryParams = asyncHandler(
  async (req, res, next) => {
    try {
      await schoolAcademicClassQueryParamsValidationSchema.validateAsync(
        req.params.id
      );
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolFeeQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await schoolFeeQueryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateSchoolFeesPutReqBody,
  validateSchoolFeesPostReqBody,
  validateSchoolFeeQueryParams,
  validateSchoolFeesAcademicClassQueryParams,
};
