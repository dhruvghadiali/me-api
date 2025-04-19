const Joi = require("joi");

const postAcademicGradeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const putAcademicGradeReqBodyValidationSchema = Joi.object({})
  .empty({})
  .required()
  .unknown(false)
  .messages({
    "any.required": "",
    "object.base": "",
    "object.empty": "",
    "object.unknown": "",
  });

const academicGradeQueryParamsValidationSchema = Joi.string().required();

module.exports = {
  putAcademicGradeReqBodyValidationSchema,
  postAcademicGradeReqBodyValidationSchema,
  academicGradeQueryParamsValidationSchema,
};
