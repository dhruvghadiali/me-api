const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
const {
  HTTP_STATUS_CODES,
  USER_TYPES_FOR_ADDRESS,
} = require("@ME/helpers/enums");
const {
  addressMinChar,
  addressMaxChar,
} = require("@MEHelpers/validationConst");
const {
  checkValidObjectId,
  isActiveCityExists,
  isActiveStateExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  addressProfileUserTypeBase,
  addressProfileUserTypeEmpty,
  addressProfileUserTypeInvalid,
  addressProfileAddressBase,
  addressProfileAddressEmpty,
  addressProfileAddressMinLength,
  addressProfileAddressMaxLength,
  addressProfileStateBase,
  addressProfileStateEmpty,
  addressProfileStateInvalid,
  addressProfileDistrictBase,
  addressProfileDistrictEmpty,
  addressProfileDistrictInvalid,
  addressProfileCityBase,
  addressProfileCityEmpty,
  addressProfileCityInvalid,
  addressProfileAreaNameBase,
  addressProfileAreaNameEmpty,
  addressProfileAreaNameInvalid,
  addressProfileZipcodeBase,
  addressProfileZipcodeEmpty,
  addressProfileZipcodeInvalid,
  addressProfileReqBodyBase,
  addressProfileReqBodyEmpty,
  addressProfileReqBodyUnknown,
  addressProfileReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const validationPutSchema = Joi.object({
  user_type: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .valid(...Object.values(USER_TYPES_FOR_ADDRESS))
    .messages({
      "string.base": addressProfileUserTypeBase,
      "string.empty": addressProfileUserTypeEmpty,
      "any.only": addressProfileUserTypeInvalid,
    }),
  address: Joi.string()
    .trim()
    .lowercase()
    .optional()
    .min(addressMinChar)
    .max(addressMaxChar)
    .messages({
      "string.base": addressProfileAddressBase,
      "string.empty": addressProfileAddressEmpty,
      "string.min": addressProfileAddressMinLength,
      "string.max": addressProfileAddressMaxLength,
    }),
  state: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveStateExists)
    .messages({
      "string.base": addressProfileStateBase,
      "string.empty": addressProfileStateEmpty,
      "any.invalid": addressProfileStateInvalid,
    }),
  district: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveDistrictExists)
    .messages({
      "string.base": addressProfileDistrictBase,
      "string.empty": addressProfileDistrictEmpty,
      "any.invalid": addressProfileDistrictInvalid,
    }),
  city: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveCityExists)
    .messages({
      "string.base": addressProfileCityBase,
      "string.empty": addressProfileCityEmpty,
      "any.invalid": addressProfileCityInvalid,
    }),
  area_name: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveAreaNameExists)
    .messages({
      "string.base": addressProfileAreaNameBase,
      "string.empty": addressProfileAreaNameEmpty,
      "any.invalid": addressProfileAreaNameInvalid,
    }),
  zipcode: Joi.string()
    .trim()
    .optional()
    .custom(checkValidObjectId)
    .external(isActiveZipcodeExists)
    .messages({
      "string.base": addressProfileZipcodeBase,
      "string.empty": addressProfileZipcodeEmpty,
      "any.invalid": addressProfileZipcodeInvalid,
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

const validateUpdateAddressProfilePutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPutSchema.validateAsync(req.body);
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
  validateUpdateAddressProfilePutReqBody,
};
