const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveZipcodeExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const { zipcode } = require("@MEHelpers/regex");
const {
  zipcodeBase,
  zipcodeEmpty,
  zipcodeIdBase,
  invalidZipcode,
  areaNameIdBase,
  zipcodeNotFound,
  zipcodeRequired,
  zipcodeIdInvalid,
  areaNameNotFound,
  zipcodeIdRequired,
  areaNameIdInvalid,
  areaNameIdRequired,
  zipcodeReqBodyBase,
  zipcodeReqBodyEmpty,
  zipcodeReqBodyUnknown,
  zipcodeReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const postValidationSchema = Joi.object({
  area_name: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveAreaNameExists)
    .required()
    .messages({
      "string.base": areaNameIdBase,
      "any.invalid": areaNameIdInvalid,
      "any.required": areaNameIdRequired,
      "any.notFound": areaNameNotFound,
    }),
  name: Joi.string().trim().pattern(zipcode).required().messages({
    "string.base": zipcodeBase,
    "string.empty": zipcodeEmpty,
    "string.pattern.base": invalidZipcode,
    "any.required": zipcodeRequired,
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": zipcodeReqBodyBase,
    "object.empty": zipcodeReqBodyEmpty,
    "object.unknown": zipcodeReqBodyUnknown,
    "any.required": zipcodeReqBodyRequired,
  });

const putValidationSchema = Joi.object({
  area_name: Joi.string()
    .trim()
    .custom(checkValidObjectId)
    .external(isActiveAreaNameExists)
    .messages({
      "string.base": areaNameIdBase,
      "any.invalid": areaNameIdInvalid,
      "any.notFound": areaNameNotFound,
    }),
  name: Joi.string().trim().pattern(zipcode).messages({
    "string.base": zipcodeBase,
    "string.empty": zipcodeEmpty,
    "string.pattern.base": invalidZipcode,
  }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": zipcodeReqBodyBase,
    "object.empty": zipcodeReqBodyEmpty,
    "object.unknown": zipcodeReqBodyUnknown,
    "any.required": zipcodeReqBodyRequired,
  });

const queryParamsValidationSchema = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveZipcodeExists)
  .messages({
    "string.base": zipcodeIdBase,
    "any.invalid": zipcodeIdInvalid,
    "any.required": zipcodeIdRequired,
    "any.notFound": zipcodeNotFound,
  });

const validateZipcodesPostReqBody = asyncHandler(async (req, res, next) => {
  try {
    await postValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateZipcodesPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await putValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

const validateZipcodesQueryParams = asyncHandler(async (req, res, next) => {
  try {
    await queryParamsValidationSchema.validateAsync(req.params.id);
    next();
  } catch (err) {
    next(new ErrorResponse(setValidationMessage(err), 400));
  }
});

module.exports = {
  validateZipcodesPutReqBody,
  validateZipcodesPostReqBody,
  validateZipcodesQueryParams,
};
