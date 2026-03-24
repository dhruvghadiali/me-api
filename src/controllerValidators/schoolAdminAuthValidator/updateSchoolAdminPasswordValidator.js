const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  passwordMinChar,
  passwordMaxCharWithoutEncryption,
} = require("@MEHelpers/validationConst");
const {
  passwordBase,
  passwordEmpty,
  passwordRequired,
  passwordMinLength,
  passwordMaxLengthWithoutEncryption,
  changePasswordReqBodyRequired,
  changePasswordReqBodyEmpty,
  changePasswordReqBodyBase,
  changePasswordReqBodyUnknown,
} = require("@MEHelpers/validationMessage");

const validateSchoolAdminUpdatePasswordPutSchema = Joi.object({
  existing_password: Joi.string()
    .required()
    .empty()
    .trim()
    .min(passwordMinChar)
    .max(passwordMaxCharWithoutEncryption)
    .messages({
      "string.empty": passwordEmpty,
      "string.base": passwordBase,
      "any.required": passwordRequired,
      "string.min": passwordMinLength,
      "string.max": passwordMaxLengthWithoutEncryption,
    }),
  new_password: Joi.string()
    .required()
    .empty()
    .trim()
    .min(passwordMinChar)
    .max(passwordMaxCharWithoutEncryption)
    .messages({
      "string.empty": passwordEmpty,
      "string.base": passwordBase,
      "any.required": passwordRequired,
      "string.min": passwordMinLength,
      "string.max": passwordMaxLengthWithoutEncryption,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": changePasswordReqBodyBase,
    "object.empty": changePasswordReqBodyEmpty,
    "object.unknown": changePasswordReqBodyUnknown,
    "any.required": changePasswordReqBodyRequired,
  });

/**
 * @desc    Validate school admin update password request body
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @access  Private/School Admin
 */
const validateUpdateSchoolAdminPasswordPutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validateSchoolAdminUpdatePasswordPutSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(
        new ErrorResponse(
          setValidationMessage(err),
          HTTP_STATUS_CODES.STATUS_400
        )
      );
    }
  }
);

module.exports = {
  validateUpdateSchoolAdminPasswordPutReqBody,
};
