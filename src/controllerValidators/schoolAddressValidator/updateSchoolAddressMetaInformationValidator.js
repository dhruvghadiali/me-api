const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { timeRegex } = require("@MEHelpers/regex");
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
  latitudeMin,
  latitudeMax,
  longitudeMin,
  longitudeMax,
  campusAreaMin,
  campusAreaMax,
  buildingAreaMin,
  buildingAreaMax,
  outdoorAreaMin,
  outdoorAreaMax,
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
  latitudeInvalidFormate,
  latitudeMinLength,
  latitudeMaxLength,
  longitudeInvalidFormate,
  longitudeMinLength,
  longitudeMaxLength,
  campusAreaInvalidFormate,
  campusAreaMinLength,
  campusAreaMaxLength,
  buildingAreaInvalidFormate,
  buildingAreaMinLength,
  buildingAreaMaxLength,
  outdoorAreaInvalidFormate,
  outdoorAreaMinLength,
  outdoorAreaMaxLength,
  schoolHoursInvalidFormate,
  schoolHoursUnknownProperty,
  schoolHoursDayInvalidFormate,
  schoolHoursDayUnknownProperty,
  schoolHoursOpenTimeInvalidFormate,
  schoolHoursOpenTimeEmpty,
  schoolHoursOpenTimeInvalid,
  schoolHoursCloseTimeInvalidFormate,
  schoolHoursCloseTimeEmpty,
  schoolHoursCloseTimeInvalid,
  administrativeHoursInvalidFormate,
  administrativeHoursUnknownProperty,
  administrativeHoursDayInvalidFormate,
  administrativeHoursDayUnknownProperty,
  administrativeHoursOpenTimeInvalidFormate,
  administrativeHoursOpenTimeEmpty,
  administrativeHoursOpenTimeInvalid,
  administrativeHoursCloseTimeInvalidFormate,
  administrativeHoursCloseTimeEmpty,
  administrativeHoursCloseTimeInvalid,
} = require("@MEHelpers/validationMessage");

const schoolHoursDaySchema = Joi.object({
  open_time: Joi.string().trim().pattern(timeRegex).messages({
    "string.base": schoolHoursOpenTimeInvalidFormate,
    "string.empty": schoolHoursOpenTimeEmpty,
    "string.pattern.base": schoolHoursOpenTimeInvalid,
  }),
  close_time: Joi.string().trim().pattern(timeRegex).messages({
    "string.base": schoolHoursCloseTimeInvalidFormate,
    "string.empty": schoolHoursCloseTimeEmpty,
    "string.pattern.base": schoolHoursCloseTimeInvalid,
  }),
})
  .unknown(false)
  .messages({
    "object.base": schoolHoursDayInvalidFormate,
    "object.unknown": schoolHoursDayUnknownProperty,
  });

const administrativeHoursDaySchema = Joi.object({
  open_time: Joi.string().trim().pattern(timeRegex).messages({
    "string.base": administrativeHoursOpenTimeInvalidFormate,
    "string.empty": administrativeHoursOpenTimeEmpty,
    "string.pattern.base": administrativeHoursOpenTimeInvalid,
  }),
  close_time: Joi.string().trim().pattern(timeRegex).messages({
    "string.base": administrativeHoursCloseTimeInvalidFormate,
    "string.empty": administrativeHoursCloseTimeEmpty,
    "string.pattern.base": administrativeHoursCloseTimeInvalid,
  }),
})
  .unknown(false)
  .messages({
    "object.base": administrativeHoursDayInvalidFormate,
    "object.unknown": administrativeHoursDayUnknownProperty,
  });

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
  latitude: Joi.number().min(latitudeMin).max(latitudeMax).messages({
    "number.base": latitudeInvalidFormate,
    "number.min": latitudeMinLength,
    "number.max": latitudeMaxLength,
  }),
  longitude: Joi.number().min(longitudeMin).max(longitudeMax).messages({
    "number.base": longitudeInvalidFormate,
    "number.min": longitudeMinLength,
    "number.max": longitudeMaxLength,
  }),
  campus_area: Joi.number().min(campusAreaMin).max(campusAreaMax).messages({
    "number.base": campusAreaInvalidFormate,
    "number.min": campusAreaMinLength,
    "number.max": campusAreaMaxLength,
  }),
  building_area: Joi.number()
    .min(buildingAreaMin)
    .max(buildingAreaMax)
    .messages({
      "number.base": buildingAreaInvalidFormate,
      "number.min": buildingAreaMinLength,
      "number.max": buildingAreaMaxLength,
    }),
  outdoor_area: Joi.number().min(outdoorAreaMin).max(outdoorAreaMax).messages({
    "number.base": outdoorAreaInvalidFormate,
    "number.min": outdoorAreaMinLength,
    "number.max": outdoorAreaMaxLength,
  }),
  school_hours: Joi.object({
    monday: schoolHoursDaySchema,
    tuesday: schoolHoursDaySchema,
    wednesday: schoolHoursDaySchema,
    thursday: schoolHoursDaySchema,
    friday: schoolHoursDaySchema,
    saturday: schoolHoursDaySchema,
  })
    .unknown(false)
    .messages({
      "object.base": schoolHoursInvalidFormate,
      "object.unknown": schoolHoursUnknownProperty,
    }),
  administrative_hours: Joi.object({
    monday: administrativeHoursDaySchema,
    tuesday: administrativeHoursDaySchema,
    wednesday: administrativeHoursDaySchema,
    thursday: administrativeHoursDaySchema,
    friday: administrativeHoursDaySchema,
    saturday: administrativeHoursDaySchema,
  })
    .unknown(false)
    .messages({
      "object.base": administrativeHoursInvalidFormate,
      "object.unknown": administrativeHoursUnknownProperty,
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

const validateSchoolAddressMetaInformationPutReqBody = asyncHandler(
  async (req, res, next) => {
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
  },
);

module.exports = {
  validateSchoolAddressMetaInformationPutReqBody,
};
