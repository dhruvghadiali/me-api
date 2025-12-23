const Joi = require("joi");

const ErrorResponse = require("@MEUtils/errorResponse");
const AdmissionApplication = require("@MEModels/admissionApplicationModel");

const { asyncHandler } = require("@MEMiddleware/async");
const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const { ADMISSION_APPLICATION_STATUS } = require("@MEHelpers/enums");
const {
  checkValidObjectId,
  isActiveSchoolAcademicClassExists,
} = require("@MEUtils/reqBodyValidator");
const {
  setValidationMessage,
  currentAcademicSession,
} = require("@MEUtils/utility");
const {
  admissionApplicationSchoolAcademicClassBase,
  admissionApplicationSchoolAcademicClassEmpty,
  admissionApplicationSchoolAcademicClassInvalid,
  admissionApplicationSchoolAcademicClassNotFound,
  admissionApplicationSchoolAcademicClassRequired,
  admissionApplicationStatusBase,
  admissionApplicationStatusEmpty,
  admissionApplicationStatusInvalid,
  admissionApplicationStatusRequired,
  admissionApplicationReqBodyBase,
  admissionApplicationReqBodyEmpty,
  admissionApplicationReqBodyUnknown,
  admissionApplicationReqBodyRequired,
  admissionApplicationDuplicateExists,
  admissionApplicationValidationError,
} = require("@MEHelpers/validationMessage");

const validationPostSchema = Joi.object({
  school_academic_class: Joi.string()
    .trim()
    .required()
    .custom(checkValidObjectId)
    .external(isActiveSchoolAcademicClassExists)
    .messages({
      "string.base": admissionApplicationSchoolAcademicClassBase,
      "string.empty": admissionApplicationSchoolAcademicClassEmpty,
      "any.invalid": admissionApplicationSchoolAcademicClassInvalid,
      "any.required": admissionApplicationSchoolAcademicClassRequired,
      "any.notFound": admissionApplicationSchoolAcademicClassNotFound,
    }),
  status: Joi.string()
    .trim()
    .valid(
      ADMISSION_APPLICATION_STATUS.DRAFT,
      ADMISSION_APPLICATION_STATUS.SUBMITTED
    )
    .required()
    .messages({
      "string.base": admissionApplicationStatusBase,
      "string.empty": admissionApplicationStatusEmpty,
      "any.only": admissionApplicationStatusInvalid,
      "any.required": admissionApplicationStatusRequired,
    }),
})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "object.base": admissionApplicationReqBodyBase,
    "object.empty": admissionApplicationReqBodyEmpty,
    "object.unknown": admissionApplicationReqBodyUnknown,
    "any.required": admissionApplicationReqBodyRequired,
  });

const validateAddAdmissionApplicationPostReqBody = asyncHandler(
  async (req, res, next) => {
    try {
      // Validate request body schema
      await validationPostSchema.validateAsync(req.body);

      // Check for duplicate admission application
      try {
        const existingApplication = await AdmissionApplication.findOne({
          school_academic_class: req?.body?.school_academic_class || null,
          applicant_user: req?.user?._id || null,
          academic_session: currentAcademicSession(),
        });

        if (existingApplication) {
          return next(
            new ErrorResponse(
              admissionApplicationDuplicateExists,
              HTTP_STATUS_CODES.STATUS_409
            )
          );
        }
      } catch (dbError) {
        return next(
          new ErrorResponse(
            admissionApplicationValidationError,
            HTTP_STATUS_CODES.STATUS_400
          )
        );
      }

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
  validateAddAdmissionApplicationPostReqBody,
};
