const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveSchoolExists,
} = require("@MEUtils/reqBodyValidator");
const {
  schoolIdBase,
  schoolIdEmpty,
  schoolIdInvalid,
  schoolIdRequired,
  schoolIdNotFound,
} = require("@MEHelpers/validationMessage");

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

module.exports = {
  validateSchoolFacilityQueryParamsForSchool,
};
