const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");
const {
  HTTP_STATUS_CODES,
} = require("@ME/helpers/enums");
const {
  schoolAboutMaxChar,
  schoolAboutMinChar,
} = require("@MEHelpers/validationConst");
const {
  schoolAboutBase,
  schoolAboutEmpty,
  schoolAboutMaxLength,
  schoolAboutMinLength,
  schoolAboutReqBodyBase,
  schoolAboutReqBodyEmpty,
  schoolAboutReqBodyUnknown,
  schoolAboutReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const validationPutSchema = Joi.object({
  about: Joi.string()
    .trim()
    .optional()
    .min(schoolAboutMinChar)
    .max(schoolAboutMaxChar)
    .messages({
      "string.base": schoolAboutBase,
      "string.empty": schoolAboutEmpty,
      "string.min": schoolAboutMinLength,
      "string.max": schoolAboutMaxLength,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolAboutReqBodyBase,
    "object.empty": schoolAboutReqBodyEmpty,
    "object.unknown": schoolAboutReqBodyUnknown,
    "any.required": schoolAboutReqBodyRequired,
  });

const validateUpdateSchoolAboutReqBody = asyncHandler(
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
  validateUpdateSchoolAboutReqBody,
};
