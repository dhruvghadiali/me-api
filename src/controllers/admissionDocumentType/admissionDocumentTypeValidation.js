const Joi = require("joi");

const postAdmissionDocumentTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putAdmissionDocumentTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const admissionDocumentTypeQueryParamsValidationSchema =
  Joi.string().required();

module.exports = {
  putAdmissionDocumentTypeReqBodyValidationSchema,
  postAdmissionDocumentTypeReqBodyValidationSchema,
  admissionDocumentTypeQueryParamsValidationSchema,
};
