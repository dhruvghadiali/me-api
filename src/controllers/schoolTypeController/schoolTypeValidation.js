const Joi = require("joi");

const postSchoolTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putSchoolTypeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const schoolTypeQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putSchoolTypeReqBodyValidationSchema,
  postSchoolTypeReqBodyValidationSchema,
  schoolTypeQueryParamsValidationSchema,
};
