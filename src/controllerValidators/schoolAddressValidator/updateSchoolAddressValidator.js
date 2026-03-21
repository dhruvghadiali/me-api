const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@ME/helpers/enums");
const { setValidationMessage } = require("@MEUtils/utility");
const {
  checkValidObjectId,
  isActiveCityExists,
  isActiveStateExists,
  isActiveZipcodeExists,
  isActiveDistrictExists,
  isActiveAreaNameExists,
} = require("@MEUtils/reqBodyValidator");
const {
  addressMaxChar,
  addressMinChar,
} = require("@MEHelpers/validationConst");
const {
  addressEmpty,
  addressRequired,
  addressMinLength,
  addressMaxLength,
  addressInvalidFormate,
  stateNameInvalid,
  stateNameRequired,
  stateNameNotFound,
  districtNameInvalid,
  districtNameRequired,
  districtNameNotFound,
  cityNameInvalid,
  cityNameRequired,
  cityNameNotFound,
  areaNameInvalid,
  areaNameRequired,
  areaNameNotFound,
  zipcodeInvalid,
  zipcodeRequired,
  zipcodeNotFound,
  schoolAddressDetailsEmpty,
  schoolAddressDetailsRequired,
  schoolAddressDetailsMustBeObject,
  schoolAddressDetailsUnknownProperty,
} = require("@MEHelpers/validationMessage");

const validationPutSchema = Joi.object({
  address: Joi.string()
    .trim()
    .lowercase()
    .min(addressMinChar)
    .max(addressMaxChar)
    .required()
    .messages({
      "string.base": addressInvalidFormate,
      "string.empty": addressEmpty,
      "string.min": addressMinLength,
      "string.max": addressMaxLength,
      "any.required": addressRequired,
    }),
  state: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveStateExists)
    .required()
    .messages({
      "any.required": stateNameRequired,
      "any.invalid": stateNameInvalid,
      "any.notFound": stateNameNotFound,
    }),
  district: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveDistrictExists)
    .required()
    .messages({
      "any.required": districtNameRequired,
      "any.invalid": districtNameInvalid,
      "any.notFound": districtNameNotFound,
    }),
  city: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveCityExists)
    .required()
    .messages({
      "any.required": cityNameRequired,
      "any.invalid": cityNameInvalid,
      "any.notFound": cityNameNotFound,
    }),
  area_name: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveAreaNameExists)
    .required()
    .messages({
      "any.required": areaNameRequired,
      "any.invalid": areaNameInvalid,
      "any.notFound": areaNameNotFound,
    }),
  zipcode: Joi.string()
    .custom(checkValidObjectId)
    .external(isActiveZipcodeExists)
    .required()
    .messages({
      "any.required": zipcodeRequired,
      "any.invalid": zipcodeInvalid,
      "any.notFound": zipcodeNotFound,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": schoolAddressDetailsRequired,
    "object.base": schoolAddressDetailsMustBeObject,
    "object.empty": schoolAddressDetailsEmpty,
    "object.unknown": schoolAddressDetailsUnknownProperty,
  });

const validateSchoolAddressPutReqBody = asyncHandler(async (req, res, next) => {
  try {
    await validationPutSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(
      new ErrorResponse(
        setValidationMessage(error),
        HTTP_STATUS_CODES.STATUS_400,
      ),
    );
  }
});

module.exports = {
  validateSchoolAddressPutReqBody,
};
