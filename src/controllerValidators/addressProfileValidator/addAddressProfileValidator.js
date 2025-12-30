const _ = require("lodash");
const Joi = require("joi");

const Address = require("@MEModels/addressModel");
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
  addressProfileUserTypeRequired,
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
  addressProfileUserTypeDuplicate,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  user_type: Joi.string()
    .trim()
    .lowercase()
    .required()
    .valid(...Object.values(USER_TYPES_FOR_ADDRESS))
    .messages({
      "string.base": addressProfileUserTypeBase,
      "string.empty": addressProfileUserTypeEmpty,
      "any.only": addressProfileUserTypeInvalid,
      "any.required": addressProfileUserTypeRequired,
    }),
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

      // Check for duplicate address entry with same user_type
      const duplicateAddress = await Address.findOne({
        user: req.user?.id,
        user_type: _.lowerCase(req.body?.user_type || ""),
      });

      if (duplicateAddress) {
        return next(
          new ErrorResponse(
            addressProfileUserTypeDuplicate,
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }

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
