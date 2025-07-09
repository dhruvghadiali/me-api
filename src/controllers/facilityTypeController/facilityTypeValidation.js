const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveFacilityTypeExists,
} = require("@MEUtils/reqBodyValidator");
const {
  facilityTypeMaxChar,
  facilityTypeMinChar,
} = require("@MEHelpers/validationConst");
const {
  facilityTypeBase,
  facilityTypeEmpty,
  facilityTypeIdBase,
  facilityTypeNotFound,
  facilityTypeRequired,
  facilityTypeIdInvalid,
  facilityTypeMaxLength,
  facilityTypeMinLength,
  facilityTypeIdRequired,
  facilityTypeReqBodyBase,
  facilityTypeReqBodyEmpty,
  facilityTypeReqBodyUnknown,
  facilityTypeReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  facility_type: Joi.string()
    .trim()
    .min(facilityTypeMinChar)
    .max(facilityTypeMaxChar)
    .required()
    .messages({
      "string.base": facilityTypeBase,
      "string.empty": facilityTypeEmpty,
      "string.min": facilityTypeMinLength,
      "string.max": facilityTypeMaxLength,
      "any.required": facilityTypeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": facilityTypeReqBodyBase,
    "object.empty": facilityTypeReqBodyEmpty,
    "object.unknown": facilityTypeReqBodyUnknown,
    "any.required": facilityTypeReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  facility_type: Joi.string()
    .trim()
    .min(facilityTypeMinChar)
    .max(facilityTypeMaxChar)
    .required()
    .messages({
      "string.base": facilityTypeBase,
      "string.empty": facilityTypeEmpty,
      "string.min": facilityTypeMinLength,
      "string.max": facilityTypeMaxLength,
      "any.required": facilityTypeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": facilityTypeReqBodyBase,
    "object.empty": facilityTypeReqBodyEmpty,
    "object.unknown": facilityTypeReqBodyUnknown,
    "any.required": facilityTypeReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveFacilityTypeExists)
  .messages({
    "string.base": facilityTypeIdBase,
    "any.invalid": facilityTypeIdInvalid,
    "any.required": facilityTypeIdRequired,
    "any.notFound": facilityTypeNotFound,
  });

const validateFacilityTypesPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await postValidationSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateFacilityTypesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateFacilityTypesQueryParams = asyncHandler(
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
  validateFacilityTypesPutReqBody,
  validateFacilityTypesPostReqBody,
  validateFacilityTypesQueryParams,
};
