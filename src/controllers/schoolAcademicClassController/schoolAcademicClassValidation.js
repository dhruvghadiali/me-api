const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const { setValidationMessage } = require("@MEUtils/utility");

const {
  checkValidObjectId,
  isActiveSchoolExists,
  isActiveAcademicClassExists,
  isActiveEducationBoardExists,
  isActiveSchoolAcademicClassExists,
  isSchoolHasActiveEducationBoardExists,
} = require("@MEUtils/reqBodyValidator");
const {
  schoolIdBase,
  schoolIdInvalid,
  schoolIdRequired,
  schoolIdNotFound,
  schoolDetailsEmpty,
  educationBoardEmpty,
  educationBoardIdBase,
  educationBoardIdInvalid,
  educationBoardIdRequired,
  educationBoardIdNotFound,
  academicClassEmpty,
  academicClassIdBase,
  academicClassNotFound,
  academicClassIdInvalid,
  academicClassIdRequired,
  schoolAcademicClassReqBodyBase,
  schoolAcademicClassReqBodyEmpty,
  schoolAcademicClassReqBodyUnknown,
  schoolAcademicClassReqBodyRequired,
  schoolAcademicClassIdBase,
  schoolAcademicClassIdInvalid,
  schoolAcademicClassIdRequired,
  schoolAcademicClassNotFound,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  school: Joi.string()
    .required()
    .empty()
    .custom(checkValidObjectId)
    .external(isActiveSchoolExists)
    .messages({
      "string.empty": schoolDetailsEmpty,
      "string.base": schoolIdBase,
      "any.invalid": schoolIdInvalid,
      "any.required": schoolIdRequired,
      "any.notFound": schoolIdNotFound,
    }),
  education_board: Joi.string()
    .required()
    .empty()
    .custom(checkValidObjectId)
    .external(isSchoolHasActiveEducationBoardExists)
    .messages({
      "string.empty": educationBoardEmpty,
      "string.base": educationBoardIdBase,
      "any.invalid": educationBoardIdInvalid,
      "any.required": educationBoardIdRequired,
      "any.notFound": educationBoardIdNotFound,
    }),
  academic_class: Joi.string()
    .required()
    .empty()
    .custom(checkValidObjectId)
    .external(isActiveAcademicClassExists)
    .messages({
      "string.empty": academicClassEmpty,
      "string.base": academicClassIdBase,
      "any.invalid": academicClassIdInvalid,
      "any.required": academicClassIdRequired,
      "any.notFound": academicClassNotFound,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": schoolAcademicClassReqBodyBase,
    "object.empty": schoolAcademicClassReqBodyEmpty,
    "object.unknown": schoolAcademicClassReqBodyUnknown,
    "any.required": schoolAcademicClassReqBodyRequired,
  });

const validationQueryParamsSchemaForId = Joi.string()
  .required()
  .custom(checkValidObjectId)
  .external(isActiveSchoolAcademicClassExists)
  .messages({
    "string.base": schoolAcademicClassIdBase,
    "any.invalid": schoolAcademicClassIdInvalid,
    "any.required": schoolAcademicClassIdRequired,
    "any.notFound": schoolAcademicClassNotFound,
  });

const validationQueryParamsSchemaForSchool = Joi.string()
  .required()
  .empty()
  .custom(checkValidObjectId)
  .external(isActiveSchoolExists)
  .messages({
    "string.empty": schoolDetailsEmpty,
    "string.base": schoolIdBase,
    "any.invalid": schoolIdInvalid,
    "any.required": schoolIdRequired,
    "any.notFound": schoolIdNotFound,
  });

const validationQueryParamsSchemaForEducationBoard = Joi.string()
  .required()
  .empty()
  .custom(checkValidObjectId)
  .external(isActiveEducationBoardExists)
  .messages({
    "string.empty": educationBoardEmpty,
    "string.base": educationBoardIdBase,
    "any.invalid": educationBoardIdInvalid,
    "any.required": educationBoardIdRequired,
    "any.notFound": educationBoardIdNotFound,
  });

const validateSchoolAcademicClassPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      await validationPostSchema.validateAsync(req.body);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolAcademicClassQueryParamsForId = asyncHandler(
  async (req, res, next) => {
    try {
      await validationQueryParamsSchemaForId.validateAsync(req.params.id);
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  }
);

const validateSchoolAcademicClassQueryParamsForSchool = asyncHandler(
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

const validateSchoolAcademicClassDeleteQueryParamsForEducationBoard =
  asyncHandler(async (req, res, next) => {
    try {
      await validationQueryParamsSchemaForEducationBoard.validateAsync(
        req.params.education_board
      );
      next();
    } catch (err) {
      next(new ErrorResponse(setValidationMessage(err), 400));
    }
  });

module.exports = {
  validateSchoolAcademicClassPostReqBody,
  validateSchoolAcademicClassQueryParamsForId,
  validateSchoolAcademicClassQueryParamsForSchool,
  validateSchoolAcademicClassDeleteQueryParamsForEducationBoard,
};
