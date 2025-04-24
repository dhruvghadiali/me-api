const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveStateExists,
  isActiveDistrictExists,
} = require("@MEUtils/reqBodyValidator");
const {
  districtNameMaxChar,
  districtNameMinChar,
} = require("@MEHelpers/validationConst");
const {
  stateIdBase,
  stateIdInvalid,
  districtIdBase,
  stateIdRequired,
  districtNameBase,
  districtNameEmpty,
  stateNameNotFound,
  districtIdInvalid,
  districtIdRequired,
  districtReqBodyBase,
  districtReqBodyEmpty,
  districtNameRequired,
  districtNameNotFound,
  districtNameMaxLength,
  districtNameMinLength,
  districtReqBodyUnknown,
  districtReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  state: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveStateExists)
    .required()
    .messages({
      "string.base": stateIdBase,
      "any.invalid": stateIdInvalid,
      "any.required": stateIdRequired,
      "any.notFound": stateNameNotFound,
    }),
  name: Joi.string()
    .trim()
    .min(districtNameMinChar)
    .max(districtNameMaxChar)
    .required()
    .messages({
      "string.base": districtNameBase,
      "string.empty": districtNameEmpty,
      "string.min": districtNameMinLength,
      "string.max": districtNameMaxLength,
      "any.required": districtNameRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": districtReqBodyBase,
    "object.empty": districtReqBodyEmpty,
    "object.unknown": districtReqBodyUnknown,
    "any.required": districtReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  state: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveStateExists)
    .messages({
      "string.base": stateIdBase,
      "any.invalid": stateIdInvalid,
      "any.notFound": stateNameNotFound,
    }),
  name: Joi.string()
    .trim()
    .min(districtNameMinChar)
    .max(districtNameMaxChar)
    .messages({
      "string.base": districtNameBase,
      "string.empty": districtNameEmpty,
      "string.min": districtNameMinLength,
      "string.max": districtNameMaxLength,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": districtReqBodyBase,
    "object.empty": districtReqBodyEmpty,
    "object.unknown": districtReqBodyUnknown,
    "any.required": districtReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveDistrictExists)
  .messages({
    "string.base": districtIdBase,
    "any.invalid": districtIdInvalid,
    "any.required": districtIdRequired,
    "any.notFound": districtNameNotFound,
  });

const validateDistrictsPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateDistrictsPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateDistrictsQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateDistrictsPutReqBody,
  validateDistrictsPostReqBody,
  validateDistrictsQueryParams,
};
