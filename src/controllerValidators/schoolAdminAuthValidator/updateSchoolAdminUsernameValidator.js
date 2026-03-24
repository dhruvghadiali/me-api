const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  usernameMinChar,
  usernameMaxChar,
  passwordMinChar,
  passwordMaxCharWithoutEncryption,
} = require("@MEHelpers/validationConst");
const {
  usernameBase,
  usernameEmpty,
  usernameRequired,
  usernameMinLength,
  usernameMaxLength,
  passwordBase,
  passwordEmpty,
  passwordRequired,
  passwordMinLength,
  passwordMaxLengthWithoutEncryption,
  updateUsernameReqBodyBase,
  updateUsernameReqBodyEmpty,
  updateUsernameReqBodyUnknown,
  updateUsernameReqBodyRequired,
} = require("@MEHelpers/validationMessage");

const validateUpdateSchoolAdminUsernamePutSchema = Joi.object({
  new_username: Joi.string()
    .required()
    .empty()
    .trim()
    .min(usernameMinChar)
    .max(usernameMaxChar)
    .messages({
      "string.empty": usernameEmpty,
      "string.base": usernameBase,
      "any.required": usernameRequired,
      "string.min": usernameMinLength,
      "string.max": usernameMaxLength,
    }),
  password: Joi.string()
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
    "object.base": updateUsernameReqBodyBase,
    "object.empty": updateUsernameReqBodyEmpty,
    "object.unknown": updateUsernameReqBodyUnknown,
    "any.required": updateUsernameReqBodyRequired,
  });

/**
 * @desc    Validate school admin update username request body
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @access  Private/School Admin
 */
const validateUpdateSchoolAdminUsernamePutReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validateUpdateSchoolAdminUsernamePutSchema.validateAsync(req.body);
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
  validateUpdateSchoolAdminUsernamePutReqBody,
};
