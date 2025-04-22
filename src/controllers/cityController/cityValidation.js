const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  isActiveCityExists,
  checkValidObjectId,
  isActiveDistrictExists,
} = require("@MEUtils/reqBodyValidator");
const {
  cityNameMaxChar,
  cityNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  cityIdBase,
  cityNameBase,
  cityNameEmpty,
  cityIdInvalid,
  cityIdRequired,
  districtIdBase,
  cityReqBodyBase,
  cityReqBodyEmpty,
  cityNameRequired,
  cityNameNotFound,
  cityNameMaxLength,
  cityNameMinLength,
  districtIdInvalid,
  districtIdRequired,
  cityReqBodyUnknown,
  cityReqBodyRequired,
  districtNameNotFound,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  district: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveDistrictExists)
    .required()
    .messages({
      "string.base": districtIdBase,
      "any.invalid": districtIdInvalid,
      "any.required": districtIdRequired,
      "any.notFound": districtNameNotFound,
    }),
  name: Joi.string()
    .trim()
    .min(cityNameMinChar)
    .max(cityNameMaxChar)
    .required()
    .messages({
      "string.base": cityNameBase,
      "string.empty": cityNameEmpty,
      "string.min": cityNameMinLength,
      "string.max": cityNameMaxLength,
      "any.required": cityNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": cityReqBodyBase,
    "object.empty": cityReqBodyEmpty,
    "object.unknown": cityReqBodyUnknown,
    "any.required": cityReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  district: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveDistrictExists)
    .messages({
      "string.base": districtIdBase,
      "any.invalid": districtIdInvalid,
      "any.notFound": districtNameNotFound,
    }),
  name: Joi.string().trim().min(cityNameMinChar).max(cityNameMaxChar).messages({
    "string.base": cityNameBase,
    "string.empty": cityNameEmpty,
    "string.min": cityNameMinLength,
    "string.max": cityNameMaxLength,
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": cityReqBodyBase,
    "object.empty": cityReqBodyEmpty,
    "object.unknown": cityReqBodyUnknown,
    "any.required": cityReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveCityExists)
  .messages({
    "string.base": cityIdBase,
    "any.invalid": cityIdInvalid,
    "any.required": cityIdRequired,
    "any.notFound": cityNameNotFound,
  });

const validateCitiesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateCitiesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateCitiesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateCitiesPostReqBody,
  validateCitiesPutReqBody,
  validateCitiesQueryParams,
};
