const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const {
  checkValidObjectId,
  isActiveCityExists,
  isActiveStateExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  addressProfileAddressBase,
  addressProfileAddressEmpty,
  addressProfileAddressMinLength,
  addressProfileAddressMaxLength,
  addressProfileAddressRequired,
  addressProfileStateBase,
  addressProfileStateEmpty,
  addressProfileStateInvalid,
  addressProfileStateRequired,
  addressProfileDistrictBase,
  addressProfileDistrictEmpty,
  addressProfileDistrictInvalid,
  addressProfileDistrictRequired,
  addressProfileCityBase,
  addressProfileCityEmpty,
  addressProfileCityInvalid,
  addressProfileCityRequired,
  addressProfileAreaNameBase,
  addressProfileAreaNameEmpty,
  addressProfileAreaNameInvalid,
  addressProfileAreaNameRequired,
  addressProfileZipcodeBase,
  addressProfileZipcodeEmpty,
  addressProfileZipcodeInvalid,
  addressProfileZipcodeRequired,
  addressProfileReqBodyBase,
  addressProfileReqBodyEmpty,
  addressProfileReqBodyUnknown,
  addressProfileReqBodyRequired,
} = require("@MEHelpers/validationMessage");
const {
  addressMinChar,
  addressMaxChar,
} = require("@MEHelpers/validationConst");

const validationPostSchema = Joi.object({
  address: Joi.string()
    .trim()
    .lowercase()
    .required()
    .min(addressMinChar)
    .max(addressMaxChar)
    .messages({
      "string.base": addressProfileAddressBase,
      "string.empty": addressProfileAddressEmpty,
      "string.min": addressProfileAddressMinLength,
      "string.max": addressProfileAddressMaxLength,
      "any.required": addressProfileAddressRequired,
    }),
  state: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveStateExists)
    .messages({
      "string.base": addressProfileStateBase,
      "string.empty": addressProfileStateEmpty,
      "any.invalid": addressProfileStateInvalid,
      "any.required": addressProfileStateRequired,
    }),
  district: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveDistrictExists)
    .messages({
      "string.base": addressProfileDistrictBase,
      "string.empty": addressProfileDistrictEmpty,
      "any.invalid": addressProfileDistrictInvalid,
      "any.required": addressProfileDistrictRequired,
    }),
  city: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveCityExists)
    .messages({
      "string.base": addressProfileCityBase,
      "string.empty": addressProfileCityEmpty,
      "any.invalid": addressProfileCityInvalid,
      "any.required": addressProfileCityRequired,
    }),
  area_name: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveAreaNameExists)
    .messages({
      "string.base": addressProfileAreaNameBase,
      "string.empty": addressProfileAreaNameEmpty,
      "any.invalid": addressProfileAreaNameInvalid,
      "any.required": addressProfileAreaNameRequired,
    }),
  zipcode: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveZipcodeExists)
    .messages({
      "string.base": addressProfileZipcodeBase,
      "string.empty": addressProfileZipcodeEmpty,
      "any.invalid": addressProfileZipcodeInvalid,
      "any.required": addressProfileZipcodeRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": addressProfileReqBodyBase,
    "object.empty": addressProfileReqBodyEmpty,
    "object.unknown": addressProfileReqBodyUnknown,
    "any.required": addressProfileReqBodyRequired,
  });

const validateAddAddressProfilePostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);
      next();
    } catch (error) {
      next(
        new ErrorResponse(
          setValidationMessage(error),
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }
  }
);

module.exports = {
  validateAddAddressProfilePostReqBody,
};
