const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveSchoolExists,
  isActiveFacilityExists,
  isActiveSchoolFacilityExists,
} = require("@MEUtils/reqBodyValidator");
const {
  schoolIdBase,
  schoolIdEmpty,
  schoolIdInvalid,
  schoolIdRequired,
  schoolIdNotFound,
  facilityIdBase,
  facilityIdEmpty,
  facilityIdInvalid,
  facilityIdRequired,
  facilityNameNotFound,
  schoolFacilityReqBodyBase,
  schoolFacilityReqBodyEmpty,
  schoolFacilityReqBodyUnknown,
  schoolFacilityReqBodyRequired,
  schoolFacilityIdBase,
  schoolFacilityIdEmpty,
  schoolFacilityIdInvalid,
  schoolFacilityIdRequired,
  schoolFacilityIdNotFound,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  school: Joi.string()
    .trim()
    .required()
    .empty()
    .custom(checkValidObjectId)
    .external(isActiveSchoolExists)
    .messages({
      "string.empty": schoolIdEmpty,
      "string.base": schoolIdBase,
      "any.invalid": schoolIdInvalid,
      "any.required": schoolIdRequired,
      "any.notFound": schoolIdNotFound,
    }),
  facility: Joi.string()
    .trim()
    .required()
    .empty()
    .custom(checkValidObjectId)
    .external(isActiveFacilityExists)
    .messages({
      "string.empty": facilityIdEmpty,
      "string.base": facilityIdBase,
      "any.invalid": facilityIdInvalid,
      "any.required": facilityIdRequired,
      "any.notFound": facilityNameNotFound,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolFacilityReqBodyBase,
    "object.empty": schoolFacilityReqBodyEmpty,
    "object.unknown": schoolFacilityReqBodyUnknown,
    "any.required": schoolFacilityReqBodyRequired,
  });

const validationQueryParamsSchemaForSchool = Joi.string()
  .required()
  .empty()
  .custom(checkValidObjectId)
  .external(isActiveSchoolExists)
  .messages({
    "string.empty": schoolIdEmpty,
    "string.base": schoolIdBase,
    "any.invalid": schoolIdInvalid,
    "any.required": schoolIdRequired,
    "any.notFound": schoolIdNotFound,
  });

const validationQueryParamsSchemaForSchoolFacilityId = Joi.string()
  .required()
  .empty()
  .custom(checkValidObjectId)
  .external(isActiveSchoolFacilityExists)
  .messages({
    "string.empty": schoolFacilityIdEmpty,
    "string.base": schoolFacilityIdBase,
    "any.invalid": schoolFacilityIdInvalid,
    "any.required": schoolFacilityIdRequired,
    "any.notFound": schoolFacilityIdNotFound,
  });

const validateSchoolFacilityPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolFacilityQueryParamsForSchool = asyncHandler(
  async (req, res, next) => {
    try {
      await validationQueryParamsSchemaForSchool.validateAsync(
        req.params.school
      );
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolFacilityQueryParamsForSchoolFacilityId = asyncHandler(
  async (req, res, next) => {
    try {
      await validationQueryParamsSchemaForSchoolFacilityId.validateAsync(
        req.params.id
      );
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

module.exports = {
  validateSchoolFacilityPostReqBody,
  validateSchoolFacilityQueryParamsForSchool,
  validateSchoolFacilityQueryParamsForSchoolFacilityId,
};
